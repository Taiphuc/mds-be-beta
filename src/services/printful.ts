import {
    OrderService, Product,
    ProductCategoryService,
    ProductService, ProductVariant, ProductVariantService, SalesChannelService,
    ShippingProfileService,
    TransactionBaseService
} from "@medusajs/medusa"
import { EntityManager } from "typeorm"
import {
    CreateFulfillmentOrder,
    CreateShipmentConfig,
    FulFillmentItemType
} from "@medusajs/medusa/dist/types/fulfillment";
import {
    CreateProductInput,
    UpdateProductInput
} from "@medusajs/medusa/dist/types/product";
import { kebabCase, capitalize, chunk, last } from "lodash";
import { backOff, IBackOffOptions } from "exponential-backoff";

import { blue, green, greenBright, red, yellow, yellowBright } from "colorette";
import SettingsService from "./settings";
import { SETTING_TYPES } from "../utils/const/settings";
import { toBoolean } from "../utils/boolean";
import FileCustomService from "./file-custom";
import PrintfulRequestService from "./printful-request";
import GetImageQueueService from "./getImageQueue";
import CustomProductBaseRepository from "../repositories/custom-product-base";
import ProductsBaseQueueService from "./productsBaseQueue";

interface CategoryAliases {
    exactMatch: { [key: string]: string };
    inexactMatch: { [key: string]: string };
}

class PrintfulService extends TransactionBaseService {

    // @ts-ignore
    protected manager_: EntityManager
    // @ts-ignore
    protected transactionManager_: EntityManager
    private productService: ProductService;
    private productCategoryService: ProductCategoryService;
    private productVariantService: ProductVariantService;
    private orderService: OrderService;
    private fulfillmentService: any
    private salesChannelService: SalesChannelService;
    private shippingProfileService: ShippingProfileService;

    private backoffOptions: IBackOffOptions;
    private printfulClient: PrintfulRequestService;
    private apiKey: string;
    private categoryAliases: CategoryAliases;
    private storeId: string;
    private printfulAccessToken: string;
    private productTags: boolean;
    private productCategories: boolean;
    private confirmOrder: boolean;
    private shippingOptionService: any;
    private settingsService: SettingsService;
    private fileCustomService: FileCustomService;
    private getImageQueueService: GetImageQueueService;
    private productsBaseQueueService: ProductsBaseQueueService;
    private customProductBaseRepository: typeof CustomProductBaseRepository;

    constructor(container, options) {
        super(container);
        this.manager_ = container.manager;
        this.productService = container.productService;
        this.productVariantService = container.productVariantService;
        this.productCategoryService = container.productCategoryService;
        this.fulfillmentService = container.fulfillmentService;
        this.orderService = container.orderService;
        this.salesChannelService = container.salesChannelService;
        this.shippingProfileService = container.shippingProfileService;
        this.shippingOptionService = container.shippingOptionService;
        this.settingsService = container.settingsService;
        this.fileCustomService = container.fileCustomService
        this.printfulClient = container.printfulRequestService
        this.getImageQueueService = container.getImageQueueService
        this.productsBaseQueueService = container.productsBaseQueueService
        this.customProductBaseRepository = container.manager.withRepository(container.customProductBaseRepository)
        this.applySettings();
        this.categoryAliases = options.categoryAliases;
    }

    async applySettings() {
        const settings = await this.settingsService.retrieve({ scope: 'admin', type: SETTING_TYPES.fulfillment })
        this.storeId = settings?.fulfillment?.printful_store_id?.value;
        await this.printfulClient.init(settings?.fulfillment?.printful_access_token?.value, this.storeId)
        this.apiKey = settings?.fulfillment?.printful_access_token?.value;
        this.productTags = toBoolean(settings?.fulfillment?.printful_product_tags?.value);
        this.productCategories = false // TODO sync categories has some issue  toBoolean(settings?.fulfillment?.printful_product_categories?.value);
        this.confirmOrder = toBoolean(settings?.fulfillment?.printful_product_categories?.value) || false;
        this.backoffOptions = {
            numOfAttempts: 10,
            delayFirstAttempt: false,
            startingDelay: 60000,
            timeMultiple: 2,
            jitter: "full",
            maxDelay: 60000,
            retry: (e: any, attempts: number) => {
                const status = e.response?.status || e.code
                if (status === 429) {
                    console.error(`${red('[printful-service]:')} Rate limit error occurred while trying to create a product! Attempt ${attempts} of ${this.backoffOptions.numOfAttempts}. Will retry...`);
                    return true;
                }
                console.error(`${red('[printful-service]:')} Error occurred while trying to create a product! Attempt ${attempts} of ${this.backoffOptions.numOfAttempts}. Error: `, red(e));
                return false;
            }
        };
    }

    async getCatalogProduct(id: string) {
        const {
            result: catalogProduct,
            code
        } = await this.printfulClient.get(`products/${id}`);

        if (code !== 200) {
            console.error("Error getting product from Printful: ", catalogProduct)
            return null;
        }
        return catalogProduct;
    }

    async getSyncProduct(id: string) {
        const {
            result: printfulStoreProduct,
            code
        } = await this.printfulClient.get(`store/products/${id}`, { store_id: this.storeId });

        if (code !== 200) {
            console.error("Error getting product from Printful: ", printfulStoreProduct)
            return null;
        }
        return printfulStoreProduct;
    }

    async getSyncVariant(id: string) {

        const {
            result: variant,
            code: code
        } = await this.printfulClient.get(`store/variants/${id}`, { store_id: this.storeId });
        if (code !== 200) {
            console.error("Error getting variant from Printful: ", variant)
            return null;
        }
        return variant;
    }

    convertToInteger(str) {
        // replace comma with period
        let numStr = str.replace(",", ".");
        // parse the number and round to the nearest integer
        return Math.round(parseFloat(numStr) * 100);
    }

    buildProductImages(printfulVariants) {
        const images = printfulVariants.flatMap(variant => (
            variant.files
                .filter(file => file.type === 'preview')
                .map(file => {
                    this.getImageQueueService.addJob({ url: file.preview_url });
                    return file.preview_url
                })
        )).filter((url, index, arr) => arr.indexOf(url) === index && url !== null && url !== '');

        const downloadImages = images?.map((url: string) => {
            const res = this.fileCustomService.getImageUrl(url);
            return res.url;
        })

        return downloadImages
    }

    async createCustomProductBase({ productId, productBaseVariants, printfulProductId }: { productId: string, printfulProductId: string, productBaseVariants: any }) {
        try {
            const { result: productVariantPrintFiles } = await this.printfulClient.get('mockup-generator/printfiles/' + printfulProductId);
            const { result: layoutTemplate } = await this.printfulClient.get('mockup-generator/templates/' + printfulProductId);
            const templateIds: number[] = [];
            layoutTemplate.variant_mapping = layoutTemplate.variant_mapping?.reduce((result, variant) => {
                const variantBaseTemp = productBaseVariants.find(e => e.id === variant.variant_id)
                if (!!variantBaseTemp) {
                    variant?.templates?.forEach((t) => { templateIds.push(t?.template_id) })
                    result.push({ ...variant, color: variantBaseTemp.color, color_code: variantBaseTemp.color_code  })
                }
                return result
            }, [])

            layoutTemplate.templates = layoutTemplate?.templates?.filter(tem => templateIds?.includes(tem?.template_id));

            layoutTemplate.templates = await Promise.all(layoutTemplate.templates?.map(async (tem) => {
                await this.getImageQueueService.addJob({ url: tem.image_url })
                tem.image_url = this.fileCustomService.getImageUrl(tem.image_url)?.url;
                return tem
            }))

            const res = await this.customProductBaseRepository.save({
                productId,
                printFileData: productVariantPrintFiles,
                templateData: layoutTemplate,
                externalId: printfulProductId
            })
            console.log(`${red('Create product base Successfully created with id: ')}`, res?.id);
        } catch (error) {
            console.log(`${red('Create product base failed: createCustomProductBase')}`, error);
        }
    }

    async createMedusaProduct(rawProduct: any) {

        const variantChunks = chunk(rawProduct.sync_variants, 10);

        return await this.atomicPhase_(async (manager) => {
            const {
                sync_product: printfulSyncProduct,
                sync_variants: printfulSyncVariants
            } = rawProduct;

            //! for get base product from printful
            const variantOfColors: any[] = []

            const defaultShippingProfile = await this.shippingProfileService.retrieveDefault();
            const defaultSalesChannel = await this.salesChannelService.retrieveDefault();


            const printfulCatalogProductVariants = []

            for (const chunk of variantChunks) {
                const chunkResults = [];

                for (const variantChunk of chunk) {
                    try {
                        const result = await backOff(async () => {
                            const {
                                result: {
                                    variant,
                                    product
                                }
                            } = await this.printfulClient.get(`products/variant/${(variantChunk as { variant_id: string }).variant_id}`);
                            return { ...variant, parentProduct: product };
                        }, this.backoffOptions);
                        chunkResults.push(result);
                    } catch (e) {
                        console.error(e);
                    }
                }

                printfulCatalogProductVariants.push(...chunkResults);
                if (chunk !== last(variantChunks)) {
                    await new Promise(resolve => setTimeout(resolve, 60000));
                }
            }

            const productCategories = this.productCategories ?
                await backOff(async () => {
                    return await this.buildProductCategory(printfulCatalogProductVariants)
                }, this.backoffOptions)
                : [];


            function buildProductOptions() {
                const hasSize = printfulCatalogProductVariants.some(({ size }) => size !== null);
                const hasColor = printfulCatalogProductVariants.some(({ color }) => color !== null);

                return [
                    ...(hasSize ? [{ title: "size" }] : []),
                    ...(hasColor ? [{ title: "color" }] : []),
                ];
            }


            const productTags = Object.keys(
                printfulCatalogProductVariants.reduce((acc, variant) => {
                    const { size, color } = variant;
                    const { type } = variant.parentProduct;
                    if (size && !acc[size]) {
                        acc[size] = true;
                    }
                    if (color && !acc[color]) {
                        acc[color] = true;
                    }
                    if (type && !acc[type]) {
                        acc[type] = true;
                    }
                    return acc;
                }, {})
            ).map((value) => ({ value: capitalize(value) }));

            const thumbnail = this.fileCustomService.getImageUrl(printfulSyncProduct.thumbnail_url);
            await this.getImageQueueService.addJob({
                name: printfulSyncProduct?.id + '_thumnail',
                url: printfulSyncProduct.thumbnail_url
            })
            const images = this.buildProductImages(printfulSyncVariants);
            const productObj: CreateProductInput = {
                title: printfulSyncProduct.name,
                handle: kebabCase(printfulSyncProduct.name),
                thumbnail: thumbnail.url,
                options: buildProductOptions(),
                images,
                tags: this.productTags ? productTags : [],
                categories: productCategories,
                profile_id: defaultShippingProfile.id,
                external_id: printfulSyncProduct.id,
                sales_channels: [{ id: defaultSalesChannel.id }],
                metadata: {
                    printful_id: printfulSyncProduct.id
                }
            };

            const productSizeGuide = await backOff(async () => {
                return await this.getProductSizeGuide(printfulSyncVariants[0].product.product_id)
            }, this.backoffOptions);


            const productVariantsObj = [];
            // options for base product
            for (const chunk of variantChunks) {
                const chunkResults = [];
                for (const { currency, id, product, retail_price, sku, variant_id } of chunk as { currency: string, id: string, product: any, retail_price: string, sku: string, variant_id: string }[]) {

                    const getVariantOptions = async () => {
                        const { result: { variant: option } } = await this.printfulClient.get(`products/variant/${variant_id}`);

                        const options = [];
                        (option.size ? options.push({ value: option.size }) : '');
                        (option.color ? options.push({ value: option.color }) : '');
                        const metadata = {
                            brand: product.name,
                            printful_id: id,
                            printful_catalog_variant_id: variant_id,
                            printful_product_id: product.product_id,
                            printful_catalog_product_id: product.id,
                            size_tables: productSizeGuide?.size_tables ?? null,
                            hex: ''
                        }
                        if (option.color) {
                            metadata.hex = option.color_code;
                        }


                        //! for get base product from printful
                        if (variantOfColors?.findIndex(v => v.color === option.color) === -1) {
                            variantOfColors.push({
                                id: variant_id,
                                color: option.color,
                                color_code: option.color_code
                            })
                        }
                        //! end for get base product from printful

                        return {
                            title: productObj.title + (option.size ? ` - ${option.size}` : '') + (option.color ? ` / ${option.color}` : ''),
                            sku: sku,
                            external_id: id,
                            manage_inventory: false,
                            allow_backorder: true,
                            inventory_quantity: 100,
                            prices: [{
                                amount: this.convertToInteger(retail_price),
                                currency_code: currency.toLowerCase()
                            }],
                            metadata,
                            options
                        }
                    }
                    const variantOptions = await backOff(getVariantOptions, this.backoffOptions);
                    chunkResults.push(variantOptions);
                }
                productVariantsObj.push(...chunkResults);

                if (chunk !== last(variantChunks)) {
                    await new Promise(resolve => setTimeout(resolve, 60000));
                }
            }

            const productToPush = {
                ...productObj,
                variants: productVariantsObj,
            }

            try {
                const createdProduct = await this.productService.create(productToPush);

                //! add create product base queue
                // await this.productsBaseQueueService.addJob(
                //     { productId: createdProduct.id, productBaseVariants: variantOfColors, printfulProductId: printfulSyncVariants[0]?.product?.product_id }
                // )
                console.log(`${green('[printful-service]:')} ==> Created product in Medusa: ${green(createdProduct.title)}`);
            } catch (e) {
                console.error(`${red("[printful-service]:")} There appeared an error trying to create '${red(productObj.title)}' in Medusa: `, e)
                throw e
            }
        })
    }


    async updateMedusaProduct(rawProduct: any, type: string, data: any) {

        return await this.atomicPhase_(async (manager) => {
            if (type === 'fromPrintful') {

                const {
                    sync_product: printfulProduct,
                    sync_variants: printfulProductVariant,
                    medusa_product: medusaProduct
                } = rawProduct;


                const variantsToDelete = medusaProduct.variants.filter(v => !printfulProductVariant.find(pv => pv.id === v.metadata.printful_id));

                if (variantsToDelete.length > 0) {
                    console.log(`${yellowBright("[printful-service]: ")} Deleting variants unsynced with Printful..`);
                    for (const variant of variantsToDelete) {
                        await this.deleteMedusaProductVariant(variant.id);
                    }
                }


                const printfulCatalogProductVariants: any[] = await backOff(async () => {
                    return await Promise.all(printfulProductVariant.map(async (v) => {
                        const {
                            result: {
                                variant,
                                product
                            }
                        } = await this.printfulClient.get(`products/variant/${v.variant_id}`);
                        return {
                            ...variant, parentProduct: product
                        }
                    }))
                }, this.backoffOptions);


                const productTags = Object.keys(
                    printfulCatalogProductVariants.reduce((acc, variant) => {
                        const { size, color } = variant;
                        const { type } = variant.parentProduct;
                        if (size && !acc[size]) {
                            acc[size] = true;
                        }
                        if (color && !acc[color]) {
                            acc[color] = true;
                        }
                        if (type && !acc[type]) {
                            acc[type] = true;
                        }
                        return acc;
                    }, {})
                ).map((value) => ({ value: capitalize(value) }));

                const productCategories = this.productCategories ? await this.buildProductCategory(printfulCatalogProductVariants) : [];

                const productObj: UpdateProductInput = {
                    title: printfulProduct.name,
                    handle: kebabCase(printfulProduct.name),
                    external_id: printfulProduct.id,
                    tags: this.productTags ? productTags : [],
                    categories: this.productCategories ? productCategories : [],
                    metadata: {
                        printful_id: printfulProduct.id,
                    }
                }


                const productSizeGuide = await backOff(async () => {
                    return await this.getProductSizeGuide(printfulProductVariant[0].product.product_id)
                }, this.backoffOptions);

                const productVariantsObj = await Promise.all(printfulProductVariant.map(async (variant) => {

                    const { result: { variant: option } } = await backOff(async () => {
                        return await this.printfulClient.get(`products/variant/${variant.variant_id}`);
                    }, this.backoffOptions)

                    const medusaVariant = medusaProduct.variants.find(v => v.metadata.printful_id === variant.id);

                    if (medusaVariant !== undefined) {
                        const title = productObj.title + (option.size ? ` - ${option.size}` : '') + (option.color ? ` / ${option.color}` : '');
                        const metadata = {
                            medusa_id: medusaVariant.id,
                            printful_id: variant.id,
                            printful_catalog_variant_id: variant.variant_id,
                            size: option.size,
                            ...productSizeGuide
                        };

                        if (option.color) {
                            metadata.color = option.color
                            metadata.color_code = option.color_code
                        }

                        return {
                            title,
                            sku: variant.sku,
                            prices: [{
                                amount: this.convertToInteger(variant.retail_price),
                                currency_code: variant.currency.toLowerCase()
                            }],
                            metadata
                        };
                    } else {
                        console.log(`${blue('[printful-service]')} Creating new variant for product ${blue(medusaProduct.id)}...`);

                        const sizeOptionId = medusaProduct.options.find(o => o.title === 'size')?.id ?? null;
                        const colorOptionId = medusaProduct.options.find(o => o.title === 'color')?.id ?? null;

                        const options = [];
                        if (sizeOptionId) {
                            options.push({
                                option_id: sizeOptionId,
                                value: option.size
                            })
                        }
                        if (colorOptionId) {
                            options.push({
                                option_id: colorOptionId,
                                value: option.color
                            })
                        }

                        const newVariant: ProductVariant = await this.productVariantService.create(medusaProduct.id, {
                            title: `${productObj.title} - ${option.size} / ${option.color}`,
                            sku: variant.sku,
                            inventory_quantity: 100,
                            allow_backorder: true,
                            manage_inventory: false,
                            options,
                            prices: [{
                                amount: this.convertToInteger(variant.retail_price),
                                currency_code: variant.currency.toLowerCase()
                            }],
                        });

                        if (newVariant) {
                            await this.productVariantService.update(newVariant.id, { metadata: { medusa_id: newVariant.id } });
                            console.log(`${green("[printful-service]: ")} Created variant '${green(newVariant.title)}' in Medusa!`);

                            const title = productObj.title + (option.size ? ` - ${option.size}` : '') + (option.color ? ` / ${option.color}` : '');
                            const metadata = {
                                medusa_id: newVariant.id,
                                printful_id: variant.id,
                                printful_catalog_variant_id: variant.variant_id,
                                size: option.size,
                                ...productSizeGuide
                            };
                            if (option.color) {
                                metadata.color = option.color
                                metadata.color_code = option.color_code
                            }
                            return {
                                title,
                                sku: variant.sku,
                                prices: [{
                                    amount: this.convertToInteger(variant.retail_price),
                                    currency_code: variant.currency.toLowerCase()
                                }],
                                metadata
                            };

                        }
                    }
                }));


                try {
                    const updatedProduct: Product = await this.productService.update(medusaProduct.id, productObj);
                    console.log(`${green("[printful-service]: ")} Updated '${green(updatedProduct.title)}' in Medusa! `);

                    const updatedVariants: Awaited<ProductVariant>[] = await Promise.all(productVariantsObj.map(async (variant) => {
                        const variantToUpdate: ProductVariant = await this.productVariantService.update(variant.metadata.medusa_id, {
                            title: variant.title,
                            sku: variant.sku,
                            metadata: variant.metadata,
                        });
                        if (variantToUpdate) {
                            return variantToUpdate;
                        }
                    }));

                    if (updatedVariants) {
                        console.log(`${green("[printful-service]: ")} Also updated '${updatedVariants.length}' variants from '${blue(updatedProduct.title)}' in Medusa!`);

                        const { variants, options } = await this.productService.retrieve(updatedProduct.id, {
                            relations: ['variants', 'options'],
                        });

                        try {
                            console.log(`${blue("[printful-service]: ")} Updating options on variants from ${blue(productObj.title)}...`);
                            const updateVariantOptionsPromises = variants.map(async (variant) => {
                                const optionValues = {};
                                options.forEach((option) => {
                                    if (option.title === 'size' || option.title === 'color') {
                                        optionValues[option.id] = variant.metadata[option.title];
                                    }
                                });
                                for (const optionId in optionValues) {
                                    try {
                                        await this.productVariantService.updateOptionValue(variant.id, optionId, optionValues[optionId]);
                                    } catch (e) {
                                        console.error(`${red("[printful-service]: ")} Error updating option value on variant ${red(variant.title)}: `, e.message);
                                    }
                                }
                            });
                            await Promise.all(updateVariantOptionsPromises);
                            console.log(`${green("[printful-service]: ")} Updated options on several variants from ${green(productObj.title)}!`);
                        } catch (e) {
                            console.error(`${red("[printful-service]: ")} Error updating options on variants from ${red(productObj.title)}:  `, e.message);
                        }

                        try {
                            console.log(`${blue("[printful-service]: ")} Updating prices on variants...`);
                            const updateVariantPricesPromises = productVariantsObj.map(async (variant) => {
                                await this.productVariantService.updateVariantPrices(variant.metadata.medusa_id, variant.prices);
                            });

                            await Promise.all(updateVariantPricesPromises);
                            console.log(`${green("[printful-service]: ")} Updated several variant prices from ${green(productObj.title)}!`);
                        } catch (e) {
                            console.error(`${red("[printful-service]: ")} There occurred an error while trying to update variant prices from ${red(productObj.title)}: `, e.message);
                        }
                    }
                } catch (e) {
                    console.error(`${red("[printful-service]: ")} Error while trying to update ${red(productObj.title)} in Medusa:`, e.message);
                }
                return "[printful-service]: Could not update product";
            }
        });
    }

    async buildProductCategory(printfulCatalogProduct: any) {

        try {
            const result = await backOff(async () => {
                const categories = printfulCatalogProduct.map(({ parentProduct }) => {
                    return {
                        main_category_id: parentProduct.main_category_id,
                    }
                })

                const { code, result } = await this.printfulClient.get(`categories/${categories[0].main_category_id}`)

                return { code, result };

            }, this.backoffOptions);

            if (result.code === 200) {
                console.log(`${blue('[printful-service]:')} Checking category alias for Printful category '${blue(result.result.category.title)}'..`)
                let categoryTitle = this?.categoryAliases?.exactMatch[result.result.category.title] || result.result.category.title;

                // If an exact alias was not found, check the inexactMatch aliases
                if (categoryTitle === result.result.category.title) {
                    for (const pattern in this?.categoryAliases?.inexactMatch) {
                        const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i'); // replace wildcard (*) with regex equivalent (.*)
                        if (regex.test(categoryTitle)) {
                            categoryTitle = this?.categoryAliases?.inexactMatch[pattern];
                            break;
                        }
                    }
                }
                if (categoryTitle !== result.result.category.title)
                    console.log(`${blue('[printful-service]:')} Category alias for Printful category '${blue(result.result.category.title)}' is '${blue(categoryTitle)}'`)

                const medusaCategory = await this.productCategoryService.listAndCount({ q: categoryTitle });
                if (medusaCategory[0].length === 0) {
                    console.log(`${blue('[printful-service]:')} Category '${blue(categoryTitle)}' not found in Medusa! Attempting to create..`)
                    return await this.atomicPhase_(async (manager) => {
                        try {
                            const newCategory = await this.productCategoryService.create({ name: categoryTitle })
                            console.log(`${green('[printful-service]:')} Successfully created category '${green(categoryTitle)}' in Medusa!`)
                            return [{ id: newCategory.id }]
                        } catch (e) {
                            console.error(`${red('[printful-service]:')} Failed creating category '${red(categoryTitle)}' in Medusa: `, e);
                        }
                    })
                } else if (medusaCategory[0].length === 1) {
                    console.log(`${blue('[printful-service]:')} Category '${blue(categoryTitle)}' found in Medusa!`)
                    return [{ id: medusaCategory[0][0].id }]
                }
                return []
            } else {
                console.error(`${red('[printful-service]:')} Failed getting category from Printful, skipping this operation! `, result);
                return []
            }
        } catch (e) {
            console.error(`${red('[printful-service]:')} Failed getting category from Printful, skipping this operation! `, e);
            return []
        }
    }


    async updatePrintfulProduct(data: any) {

        // get product from printful
        try {
            const {
                result: { sync_variants: initialSyncVariants }
            } = await this.printfulClient.get(`store/products/${data.external_id}`);

            const syncProduct = {
                external_id: data.id,
                name: data.name,
                id: initialSyncVariants.map((variant) => variant.metadata.printful_id),
                sku: data.sku
            }

            const syncVariants = data.variants.map((variant) => {
                console.log(data.variants)
                return {
                    id: variant.metadata.printful_id,
                    variant_id: variant.metadata.printful_catalog_variant_id,
                    external_id: variant.id,
                    sku: variant.sku,
                    name: variant.name,
                }
            })
        } catch (e: any) {
            console.log(red("There appeared to be an Error when trying to fetch the product from Printful!"), e)
        }

    }

    async getProductSizeGuide(printfulProductId) {
        try {
            const { result, code } = await this.printfulClient.get(`products/${printfulProductId}/sizes`, { unit: 'cm' });
            if (code === 200) {
                return result;
            }
        } catch (e: any) {
            console.log(e)
        }
    }

    async deleteMedusaProduct(productOrProductId: string) {
        try {
            await this.productService.delete(productOrProductId);
            console.log(green(`Successfully deleted product ${productOrProductId} in Medusa 🪦`))
        } catch (e) {
            console.log(`Failed to delete product ${productOrProductId} in Medusa 🙇‍♂️`)
        }
    }

    async deleteMedusaProductVariant(variantOrVariantId: string) {
        try {
            await this.productVariantService.delete(variantOrVariantId);
            console.log(`${greenBright("[printful-service]:")} Successfully deleted variant ${greenBright(variantOrVariantId)} in Medusa 🪦`)
        } catch (e) {
            console.log(`${red("[printful-service]:")} Failed to delete variant ${red(variantOrVariantId)} in Medusa 🙇‍♂️`)
        }
    }

    async getShippingRates(data) {
        console.log(`${blue("[printful-service]:")} Getting shipping rates for: `, data)
        const { recipient, items } = data;
        try {
            const shippingRates = await this.printfulClient.post("shipping/rates", {
                recipient,
                items,
                store_id: this.storeId
            });
            console.log(shippingRates)
            return shippingRates;
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async getCountryList() {
        const { result: countries } = await this.printfulClient.get("countries", { store_id: this.storeId });
        if (countries) return countries;
    }

    async createPrintfulOrder(data: any) {
        console.log(`${blue('[printful-service]:')} Creating order with order_id '${blue(data.id)}' in Printful: `, data)

        try {
            // TODO: Check if this is really necessary
            const { data: { id: printfulShippingId } } = await this.shippingOptionService.retrieve(data.shipping_methods[0].shipping_option_id)

            const orderObj = {
                external_id: data.id,
                shipping: printfulShippingId,
                recipient: {
                    name: data.shipping_address.first_name + " " + data.shipping_address.last_name,
                    address1: data.shipping_address.address_1,
                    address2: data.shipping_address.address_2 ?? '',
                    city: data.shipping_address.city,
                    state_code: data.shipping_address.province,
                    country_code: data.shipping_address.country_code,
                    zip: data.shipping_address.postal_code,
                    email: data.email,
                    phone: data.shipping_address.phone ?? '',
                },
                items: data.items.map((item: { variant: { title: any; metadata: { printful_catalog_variant_id: any; printful_id: any; }; }; variant_id: any; quantity: number; unit_price: number; }) => {
                    return {
                        name: item.variant.title,
                        external_id: item.variant_id,
                        variant_id: item.variant.metadata.printful_catalog_variant_id,
                        sync_variant_id: item.variant.metadata.printful_id,
                        quantity: item.quantity,
                        price: `${(item.unit_price / 100).toFixed(2)}`.replace('.', '.'),
                        retail_price: `${(item.unit_price / 100).toFixed(2)}`.replace('.', '.'),
                    }
                })
            }
            console.log(`${blue("[printful-service]:")} Trying to send the order to printful with the following data: `, orderObj)
            const order = await this.printfulClient.post("orders", {
                ...orderObj,
                store_id: this.storeId,
                confirm: this.confirmOrder
            });
            if (order.code === 200) {
                console.log(`${green("[printful-service]:")} Successfully created the order on Printful! `, order.result)
                return order;
            }
        } catch (e) {
            console.log(`${red("[printful-service]:")} There was an error when trying to create the order on Printful! `, e)
            return e
        }
    }

    async cancelOrder(orderId: string | number) {
        try {
            console.log(`${yellow("[printful-service]:")} Trying to cancel order with id ${yellow(orderId)} on Printful`)
            const { result, code } = await this.printfulClient.delete(`orders/@${orderId}`, { store_id: this.storeId });

            if (code === 200) {
                console.log(`${green("[printful-service]:")} Order has been successfully canceled!`, result)
                return result;
            } else {
                console.log(`${red("[printful-service]:")} There was an error when trying to cancel the order on Printful! `, result)
                return result;
            }
        } catch (e) {
            console.log(`${red("[printful-service]:")} There was an error when trying to cancel the order on Printful! `, e)
        }
    }

    async confirmDraftForFulfillment(orderId: string | number) {
        const confirmedOrder = await this.printfulClient.post(`orders/${orderId}/confirm`, { store_id: this.storeId });
        console.log(confirmedOrder)
        return confirmedOrder;
    }

    async getOrderData(orderId: string | number) {
        const { result: orderData } = await this.printfulClient.get(`orders/${orderId}`, { store_id: this.storeId });
        return orderData;
    }

    async createMedusaFulfillment(order: CreateFulfillmentOrder, itemsToFulfill: FulFillmentItemType[]) {


        console.log("LENGTH", itemsToFulfill.length)

        const fulfillmentItems = await this.fulfillmentService.getFulfillmentItems_(order, itemsToFulfill);
        console.log("FULFILLMENT ITEMS", fulfillmentItems)


        return await this.fulfillmentService.createFulfillment(order, itemsToFulfill);
    }

    async createMedusaShipment(fulfillmentId: string, trackingLinks: {
        tracking_number: string
    }[], config: CreateShipmentConfig) {
        return await this.fulfillmentService.createShipment(fulfillmentId, trackingLinks, config);
    }
}

export default PrintfulService;