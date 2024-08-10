import {UpdateProductSyncToMerchantDto} from "../types/dto/updateProductDto";
import {MedusaError} from "@medusajs/utils";
import {ProductService as MedusaProductService, Product, ProductStatus} from "@medusajs/medusa";
import GoogleMerchantSettingService from "./google-merchant-setting";
import {contentGoogle} from "../loaders/feed_product_for_google_merchant";
import OrderRepository from "../repositories/order";
import SettingsService from "./settings";
import {SETTING_TYPES} from "../utils/const/settings";
import {In, Not} from "typeorm";
import LogVisitorRepository from "../repositories/log-visitor";

class ProductService extends MedusaProductService {
    private googleMerchantSettingService: GoogleMerchantSettingService;
    private settingsService: SettingsService;
    private orderRepo_: typeof OrderRepository;
    private logVisitorRepo_: typeof LogVisitorRepository;

    constructor(container) {
        super(container);
        this.googleMerchantSettingService = container.googleMerchantSettingService;
        this.settingsService = container.settingsService;
        this.orderRepo_ = container.manager.withRepository(container.orderRepository)
        this.logVisitorRepo_ = container.manager.withRepository(container.logVisitorRepository)
    }

    async updateProductsSyncToMerchant(payload: UpdateProductSyncToMerchantDto[]): Promise<boolean> {
        try {
            // update google merchant
            const disableMerchantList = payload?.filter((product) => !product.syncToMerchant);
            if (disableMerchantList?.length > 0) {
                const promise = [];
                const googleMerchantSetting = await this.googleMerchantSettingService.retrieve();
                try {
                    if (!googleMerchantSetting.merchant_id) {
                        console.log(`🚀 ~ <============== CONFIG GOOGLE MERCHANT NOT FOUND ==============>`);
                    } else {
                        const merchantContent = contentGoogle();
                        disableMerchantList.forEach((product) => {
                            product?.variants?.forEach((variant) => {
                                promise.push(
                                    merchantContent.products.delete({
                                        merchantId: googleMerchantSetting?.merchant_id,
                                        productId: "online:en:NA:" + variant?.id,
                                    })
                                );
                            });
                        });
                    }
                    await Promise.allSettled(promise);
                } catch (error) {
                    console.log("🚀 ~ HAS ERROR IN PROMISE: ----", error)
                }
                const updateData = payload?.map((data) => ({...data, isSyncFeedForGoogleMerchant: false}));
                await this.productRepository_.save(updateData);
                return true;
            }

            await this.productRepository_.save(payload);
            return true;
        } catch (error) {
            throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "connect to google merchant failed", error);
        }
    }

    async getCustomerPurchased(customerId: string) {
        const orders = await this.orderRepo_.find({
            where: {customer_id: customerId},
            take: 10, order: {created_at: "DESC"},
            relations: {items: {variant: {product: {variants: {prices: true}}}}}
        });
        const products: Product[] = [];
        orders.forEach((order) => {
            order.items.forEach((item) => {
                if (!products?.some((product) => product.id === item?.product_id)) {
                    products.push(item?.variant?.product)
                }
            })
        })

        return products
    }

    async relatedProduct(productId: string, customerId: string, ip: string) {
        const currentProduct = await this.productRepository_.findOne({where: {id: productId}});
        if (!currentProduct) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "product not found")
        }
        const metadata: {
            related_tags?: string[],
            related_categories?: string[],
            related_products?: string[],
            related_options?: string[]
        } = currentProduct.metadata
        const settings = await this.settingsService.retrieve({scope: 'store', type: SETTING_TYPES.crossSell})
        let result: Product[] = [];
        const relations = {variants: {prices: true, options: true}}
        if (metadata?.related_products?.length > 0) {
            const products = await this.productRepository_.find({
                where: {
                    id: In(metadata?.related_products),
                    status: ProductStatus.PUBLISHED
                }, relations
            })
            result = [...result, ...products];
        }
        if (metadata?.related_tags?.length > 0) {
            const products = await this.productRepository_.find({
                where: {
                    id: Not(productId),
                    tags: {id: In(metadata?.related_tags)},
                    status: ProductStatus.PUBLISHED
                }, take: 10
            })
            result = [...result, ...products];
        } else if (settings?.crossSell?.get_by_tag?.value == '1') {
            const products = await this.productRepository_.find({
                where: {
                    id: Not(productId),
                    tags: {},
                    status: ProductStatus.PUBLISHED
                }, take: 10
            })
            result = [...result, ...products];
        }
        if (metadata?.related_categories?.length > 0) {
            const products = await this.productRepository_.find({
                where: {
                    id: Not(productId),
                    categories: {id: In(metadata?.related_categories)},
                    status: ProductStatus.PUBLISHED
                }, take: 10, relations
            })
            result = [...result, ...products];
        } else if (settings?.crossSell?.get_by_category?.value == '1') {
            const products = await this.productRepository_.find({
                where: {
                    id: Not(productId),
                    categories: {},
                    status: ProductStatus.PUBLISHED
                }, take: 10, relations
            })
            result = [...result, ...products];
        }
        if (settings?.crossSell?.get_by_collection?.value == '1' && currentProduct?.collection_id) {
            const products = await this.productRepository_.find({
                where: {
                    id: Not(productId),
                    collection_id: currentProduct.collection_id,
                    status: ProductStatus.PUBLISHED
                }, take: 10, relations
            })
            result = [...result, ...products];
        }
        if (settings?.crossSell?.get_by_viewed?.value == '1') {
            const logVisitor = await this.logVisitorRepo_.findOne({where: {ip}});
            const lastTenItems = logVisitor.products.slice(Math.max(logVisitor.products.length - 10, 0));
            const productIds = lastTenItems?.map(p => p.id)
            const products = await this.productRepository_.find({
                where: {
                    id: In(productIds),
                    status: ProductStatus.PUBLISHED
                }, relations
            })
            result = [...result, ...products];
        }
        if (settings?.crossSell?.get_by_best_sell?.value == '1') {
            const products = await this.productRepository_.find({
                where: {status: ProductStatus.PUBLISHED},
                take: 10,
                order: {soldCount: 'DESC'},
                relations
            })
            result = [...result, ...products];
        }
        if (metadata?.related_options?.length > 0) {
            const options: string[] = [];
            const optionsValue: string[] = [];
            metadata?.related_options?.forEach(res => {
                const temp = res.split('/');
                if (!options?.includes(temp[0])) {
                    options.push(temp[0]);
                }
                if (!optionsValue?.includes(temp[1])) {
                    optionsValue.push(temp[0]);
                }
            })
            const products = await this.productRepository_.find({
                where: {
                    options: {
                        title: In(options)
                    },
                    variants: {
                        options: {
                            value: In(optionsValue)
                        }
                    },
                    status: ProductStatus.PUBLISHED
                }, take: 10, relations: {...relations, options: true}
            })
            result = [...result, ...products];
        }
        console.log("🚀 => check => e:", "check22222222222")

        // if (customerId && settings?.crossSell?.get_by_buy) {
        //     const products = await this.getCustomerPurchased(customerId);
        //     result = [...result, ...products];
        // }

        if (settings?.crossSell?.hidden_products) {
            const list_product_hide = JSON.parse(settings?.crossSell?.hidden_products?.value);
            let hidden_array = [...result]
            hidden_array = hidden_array.filter((v: any) => !list_product_hide.includes(v.id));
            result = [...hidden_array];
        }

        //
        // if (settings?.crossSell?.hidden_categories) {
        //     const list_category_hide = JSON.parse(settings?.crossSell?.hidden_categories?.value);
        //     let hidden_array = [...result];
        //
        //     const promises = list_category_hide.map(async (item_array) => {
        //         return await this.productRepository_.find({
        //             where: {
        //                 id: Not(productId),
        //                 categories: {title: In(item_array)},
        //                 status: ProductStatus.PUBLISHED
        //             },
        //             take: 10,
        //             relations
        //         });
        //     });
        //
        //     const productsOfCategories = await Promise.all(promises);
        //     console.log("productsOfCategories==============")
        //     console.log(productsOfCategories)
        // }

        const order = settings?.crossSell?.order?.value

        let finalResult = result?.sort((a, b) => {
            const order_by = settings?.crossSell?.order_by?.value
            const l = !Number.isNaN(Number(a[order_by]));
            const s = a[order_by]
            if (!Number.isNaN(Number(a[order_by]))) {
                return Number(a[order_by]) - Number(b[order_by]);
            } else {

                const nameA = a[order_by].toUpperCase(); // ignore upper and lowercase
                const nameB = b[order_by].toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                // names must be equal
                return 0;
            }
        })
        if (order === "DESC") {
            finalResult = finalResult.reverse()
        }
        const uniqueIds = new Set();
        finalResult = finalResult.filter(res => {
            if (res.id !== productId && !uniqueIds.has(res.id)) {
                uniqueIds.add(res.id);
                return true;
            }
            return false;
        });
        if(settings?.crossSell?.number_product_display){
            if(settings?.crossSell?.number_product_display?.value != "0"){
                finalResult = finalResult.slice(0, Number(settings?.crossSell?.number_product_display?.value));
            }
        }

        return finalResult
    }


    async relatedProducts(productIds: string[], customerId: string, ip: string) {
        const currentProducts = await this.productRepository_.find({ where: { id: In(productIds) } });
        if (currentProducts.length === 0) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Products not found");
        }

        let result: Product[] = [];
        const relations = { variants: { prices: true, options: true } };
        const settings = await this.settingsService.retrieve({ scope: 'store', type: SETTING_TYPES.crossSell });

        const promises = currentProducts.map(async (currentProduct) => {
            const metadata: {
                related_tags?: string[],
                related_categories?: string[],
                related_products?: string[],
                related_options?: string[]
            } = currentProduct.metadata;

            const productPromises = [];

            if (metadata?.related_products?.length > 0) {
                productPromises.push(this.productRepository_.find({
                    where: { id: In(metadata.related_products), status: ProductStatus.PUBLISHED },
                    relations
                }));
            }

            if (metadata?.related_tags?.length > 0) {
                productPromises.push(this.productRepository_.find({
                    where: { id: Not(currentProduct.id), tags: { id: In(metadata.related_tags) }, status: ProductStatus.PUBLISHED },
                    take: 10
                }));
            } else if (settings?.crossSell?.get_by_tag?.value === '1') {
                productPromises.push(this.productRepository_.find({
                    where: { id: Not(currentProduct.id), tags: {}, status: ProductStatus.PUBLISHED },
                    take: 10
                }));
            }

            if (metadata?.related_categories?.length > 0) {
                productPromises.push(this.productRepository_.find({
                    where: { id: Not(currentProduct.id), categories: { id: In(metadata.related_categories) }, status: ProductStatus.PUBLISHED },
                    take: 10,
                    relations
                }));
            } else if (settings?.crossSell?.get_by_category?.value === '1') {
                productPromises.push(this.productRepository_.find({
                    where: { id: Not(currentProduct.id), categories: {}, status: ProductStatus.PUBLISHED },
                    take: 10,
                    relations
                }));
            }

            if (settings?.crossSell?.get_by_collection?.value === '1' && currentProduct?.collection_id) {
                productPromises.push(this.productRepository_.find({
                    where: { id: Not(currentProduct.id), collection_id: currentProduct.collection_id, status: ProductStatus.PUBLISHED },
                    take: 10,
                    relations
                }));
            }

            if (metadata?.related_options?.length > 0) {
                const options: string[] = [];
                const optionsValue: string[] = [];
                metadata.related_options.forEach(res => {
                    const temp = res.split('/');
                    if (!options.includes(temp[0])) options.push(temp[0]);
                    if (!optionsValue.includes(temp[1])) optionsValue.push(temp[1]);
                });

                productPromises.push(this.productRepository_.find({
                    where: {
                        options: { title: In(options) },
                        variants: { options: { value: In(optionsValue) } },
                        status: ProductStatus.PUBLISHED
                    },
                    take: 10,
                    relations: { ...relations, options: true }
                }));
            }

            return Promise.all(productPromises);
        });

        const productsResults = await Promise.all(promises);
        result = productsResults.flat(2);

        if (settings?.crossSell?.get_by_viewed?.value === '1') {
            const logVisitor = await this.logVisitorRepo_.findOne({ where: { ip } });
            if (logVisitor) {
                const lastTenItems = logVisitor.products.slice(Math.max(logVisitor.products.length - 10, 0));
                const viewedProductIds = lastTenItems.map(p => p.id);
                const products = await this.productRepository_.find({
                    where: { id: In(viewedProductIds), status: ProductStatus.PUBLISHED },
                    relations
                });
                result = [...result, ...products];
            }
        }

        if (settings?.crossSell?.get_by_best_sell?.value === '1') {
            const products = await this.productRepository_.find({
                where: { status: ProductStatus.PUBLISHED },
                take: 10,
                order: { soldCount: 'DESC' },
                relations
            });
            result = [...result, ...products];
        }

        // if (customerId && settings?.crossSell?.get_by_buy) {
        //     const products = await this.getCustomerPurchased(customerId);
        //     result = [...result, ...products];
        // }

        if (settings?.crossSell?.hidden_products) {
            const list_product_hide = JSON.parse(settings.crossSell.hidden_products.value);
            result = result.filter(v => !list_product_hide.includes(v.id));
        }

        const order = settings?.crossSell?.order?.value;
        const order_by = settings?.crossSell?.order_by?.value;
        let finalResult = result.sort((a, b) => {
            if (!Number.isNaN(Number(a[order_by]))) {
                return Number(a[order_by]) - Number(b[order_by]);
            } else {
                const nameA = a[order_by].toUpperCase();
                const nameB = b[order_by].toUpperCase();
                return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            }
        });

        if (order === "DESC") {
            finalResult = finalResult.reverse();
        }

        const uniqueIds = new Set();
        finalResult = finalResult.filter(res => {
            if (!uniqueIds.has(res.id) && !productIds.includes(res.id)) {
                uniqueIds.add(res.id);
                return true;
            }
            return false;
        });

        if (settings?.crossSell?.number_product_display?.value !== "0") {
            finalResult = finalResult.slice(0, Number(settings.crossSell.number_product_display.value));
        }

        return finalResult;
    }
}

export default ProductService;
