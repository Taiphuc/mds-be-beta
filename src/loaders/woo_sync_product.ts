import { ProductStatus } from '@medusajs/medusa';
import { AwilixContainer } from 'awilix';
import { In, IsNull, Not } from 'typeorm';
import { uuid } from 'uuidv4';

const wooSyncProduct = async (
  container: AwilixContainer,
  options: Record<string, any>
) => {
  if (process.env.CRAWL_PRODUCTS !== 'true') {
    return;
  }

  const jobSchedulerService = container.resolve('jobSchedulerService');
  const wooService = container.resolve('wooService');
  const medusaService = container.resolve('medusaService');
  const helperService = container.resolve('helperService');

  const productRepository = container.resolve('productRepository');
  const salesChannelRepository = container.resolve('salesChannelRepository');
  const regionRepository = container.resolve('regionRepository');
  const productVariantRepository = container.resolve(
    'productVariantRepository'
  );
  const productCategoryRepository = container.resolve(
    'productCategoryRepository'
  );
  const productOptionRepository = container.resolve('productOptionRepository');
  const shippingProfileRepository = container.resolve(
    'shippingProfileRepository'
  );
  const productShippingProfileRepository = container.resolve(
    'productShippingProfileRepository'
  );

  const medusa = medusaService.medusaAdmin();

  const stores = [
    {
      domain: process.env.WOO_DOMAIN,
      consumerKey: process.env.WOO_CONSUMER_KEY,
      consumerSecret: process.env.WOO_CONSUMER_SECRET,
    },
  ];

  const syncProduct = async (
    store: {
      domain: string;
      consumerKey: string;
      consumerSecret: string;
    },
    oneTimes: boolean,
    page: number = 1,
    pageSize: number = 100
  ): Promise<boolean> => {
    const mode = oneTimes ? 'NEWEST' : 'HISTORY';
    console.log(
      `🚀 ~ START MODE:: ${mode} -> SYNC PRODUCT:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}`
    );

    try {
      const wooDataProducts = await wooService.getProducts(
        store,
        page,
        pageSize,
        oneTimes ? 'desc' : 'asc'
      );

      const wooProducts = wooDataProducts.data;

      if (wooProducts && wooProducts.length) {
        try {
          await Promise.all(
            wooProducts.map((wooProd) => {
              const style = wooProd.attributes.find(
                (e) => e.name.toLowerCase() === 'style'
              );
              const material = wooProd.attributes.find(
                (e) => e.name.toLowerCase() === 'material'
              );

              return productRepository.save({
                id: uuid(),
                syncToMerchant: true,
                domain: store.domain,
                style: style ? style.options[0] : null,
                material: material ? material.options[0] : null,
                wooProductId: wooProd.id,
                title: wooProd.name,
                description: wooProd.short_description,
                is_giftcard: false,
                discountable: true,
                thumbnail:
                  wooProd.images && wooProd.images.length
                    ? wooProd.images[0].src
                    : '',
                handle: wooProd.slug,
                status: ProductStatus.DRAFT,
                weight: wooProd.weight
                  ? helperService.parseAmountAndMultiply(
                      wooProd.weight,
                      3,
                      1000
                    )
                  : null,
                length: wooProd.dimensions.length
                  ? helperService.parseAmountAndMultiply(
                      wooProd.dimensions.length,
                      3,
                      1000
                    )
                  : null,
                height: wooProd.dimensions.height
                  ? helperService.parseAmountAndMultiply(
                      wooProd.dimensions.height,
                      3,
                      1000
                    )
                  : null,
                width: wooProd.dimensions.width
                  ? helperService.parseAmountAndMultiply(
                      wooProd.dimensions.width,
                      3,
                      1000
                    )
                  : null,
                metadata: wooProd,
              });
            })
          );
          if (!oneTimes) {
            await helperService.waitForSecondTime(30);
            await syncProduct(store, false, page + 1, pageSize);
            return;
          }
        } catch (error) {
          console.log('🚀 ~ file: ERROR PRODUCT SYNC ~ error:', error.message);
          if (!oneTimes) {
            if (
              error.message.search(
                'duplicate key value violates unique constraint'
              ) > -1
            ) {
              await helperService.waitForSecondTime(30);
              await syncProduct(store, false, page + 1, pageSize);
              return;
            }
          }
        }
        console.log(
          `🚀 ~ STOP MODE:: ${mode} -> SYNC PRODUCT:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}`
        );
      } else {
        console.log(
          `🚀 ~ STOP MODE:: ${mode} -> SYNC PRODUCT:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}`
        );
      }
    } catch (error) {
      console.log(
        `🚀 ~ ERROR REQUEST MODE:: ${mode} -> SYNC PRODUCT:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}, error: ${error.message}`
      );
    }
    return true;
  };

  const createCategories = async (nameCategories: string[]) => {
    let categories = await productCategoryRepository.find({
      where: {
        name: In(nameCategories),
      },
    });

    if (categories.length < nameCategories.length) {
      const newNameCategories = nameCategories.filter(
        (nameCate) => !categories.find((e) => e.name === nameCate)
      );
      if (newNameCategories.length) {
        await Promise.all(
          newNameCategories.map((name) => {
            return medusa.admin.productCategories.create({
              name,
              is_active: true,
            });
          })
        );
      }

      categories = await productCategoryRepository.find({
        where: {
          name: In(nameCategories),
        },
      });
    }

    return categories;
  };

  const createOptionsByProduct = async (productId, attributes) => {
    const optionByProduct = await productOptionRepository.find({
      where: {
        product_id: productId,
      },
    });

    if (optionByProduct && optionByProduct.length > 0) return optionByProduct;
    await Promise.all(
      attributes.map((attr) => {
        if (
          !['style', 'customize', 'material'].includes(
            attr.name.toLowerCase()
          ) &&
          attr.variation === true
        )
          productOptionRepository.save({
            id: uuid(),
            product_id: productId,
            title: attr.name,
            metadata: attr,
          });
      })
    );
    const result = await productOptionRepository.find({
      where: {
        product_id: productId,
      },
    });
    return result;
  };

  // đồng bộ ngay sau khi khởi động app
  await stores.forEach((e) => syncProduct(e, false));

  // đồng bộ lại history mỗi 12 tiếng
  jobSchedulerService.create(
    'sync-history-products',
    {},
    '0 0-23/12 * * *',
    async () => {
      await stores.forEach((e) => syncProduct(e, false));
    }
  );

  // đồng bộ mới nhất sau mỗi 10p
  jobSchedulerService.create(
    'sync-newest-products',
    {},
    '*/10 * * * *',
    async () => {
      await stores.forEach((e) => syncProduct(e, true));
    }
  );

  jobSchedulerService.create(
    'update-metadata-products',
    {},
    '*/5 * * * *',
    async () => {
      try {
        const products = await productRepository.find({
          where: {
            status: ProductStatus.DRAFT,
            wooProductId: Not(IsNull()),
          },
          limit: 50,
        });

        if (products && products.length) {
          const nameCategories = [];

          products.forEach((prod) => {
            const metadata = prod.metadata;
            if (metadata.categories && metadata.categories.length) {
              metadata.categories.forEach((e) => {
                if (!nameCategories.includes(e.name)) {
                  nameCategories.push(e.name);
                }
              });
            }
          });

          const categories = await createCategories(nameCategories);
          const dataUpdateProducts = products.map((prod) => {
            const metadata = prod.metadata;
            const categoriesFilter =
              metadata.categories && metadata.categories.length
                ? categories.filter((cate) =>
                    metadata.categories?.find((e) => e.name === cate.name)
                  )
                : [];

            const images =
              metadata.images && metadata.images.length
                ? metadata.images.map((e) => e.src)
                : [];
            const uniqueImages = images.filter(
              (value, index, array) => array.indexOf(value) === index
            );
            return {
              images: uniqueImages,
              tags:
                metadata.tags && metadata.tags.length
                  ? metadata.tags.map((e) => ({
                      value: e.name,
                    }))
                  : [],
              categories:
                categoriesFilter && categoriesFilter.length
                  ? categoriesFilter.map((e) => ({
                      id: e.id,
                    }))
                  : [],
              status: ProductStatus.PROPOSED,
            };
          });

          for (const [index, prod] of products.entries()) {
            await medusa.admin.products.update(
              prod.id,
              dataUpdateProducts[index]
            );
          }
        }
        return true;
      } catch (error) {
        console.log(`🚀 ~ ERROR UPDATE PRODUCT:: ${error.message}`);
      }
    }
  );

  jobSchedulerService.create(
    'update-variant-products',
    {},
    '*/2 * * * *',
    async () => {
      try {
        const products = await productRepository.find({
          where: {
            status: ProductStatus.PROPOSED,
            wooProductId: Not(IsNull()),
          },
          limit: 5,
        });
        if (!products || products.length === 0) {
          return;
        }

        const [saleChannels, regions] = await Promise.all([
          salesChannelRepository.find(),
          regionRepository.find({
            where: {
              currency_code: 'usd',
            },
          }),
        ]);

        const saleChannel = saleChannels[0];
        const region = regions[0];

        if (!saleChannel) {
          throw new Error(`Sale channel not found`);
        }

        if (!region) {
          throw new Error(`Region not found`);
        }

        for (const prod of products) {
          const metadata = prod.metadata;

          if (
            !metadata.attributes ||
            (metadata.attributes && !metadata.attributes.length)
          ) {
            throw new Error(`Product ${prod.id} attributes not found`);
          }

          const optionByProduct = await createOptionsByProduct(
            prod.id,
            metadata.attributes
          );

          if (
            !optionByProduct ||
            (optionByProduct && !optionByProduct.length)
          ) {
            return;
          }

          const store = stores.find((e) => e.domain === prod.domain);
          if (!store) {
            console.log(`🚀 ~ STORE NOT FOUND:: domain: ${prod.domain}`);
          } else {
            try {
              const wooDataProductVariations =
                await wooService.getProductVariations(store, prod.wooProductId);

              const wooProductVariations = wooDataProductVariations.data;

              if (wooProductVariations && wooProductVariations.length) {
                let newVariations = [];

                wooProductVariations.forEach((prodVar) => {
                  console.log("🚀 => file: woo_sync_product.ts:403 => wooProductVariations.forEach => prodVar:", prodVar)
                  if (!prodVar.attributes[0]) {
                    throw new Error(
                      `Product variant ${prodVar.id} attributes not found`
                    );
                  }

                  let optionsByVariations = [];
                  let colorsByVar = [];

                  if (
                    prodVar.attributes.find(
                      (e) => e.name.toLowerCase() === 'size'
                    ) &&
                    prodVar.attributes.find(
                      (e) => e.name.toLowerCase() === 'color'
                    )
                  ) {
                    const colorOption = prodVar.attributes.find(
                      (e) => e.name.toLowerCase() === 'color'
                    );
                    const colors = colorOption.option.split('/');
                    colorsByVar = colors;

                    colors.forEach((color) => {
                      const optionVariantSingle = optionByProduct.map(
                        (opProd) => {
                          const opMatch = prodVar.attributes.find(
                            (e) => e.name === opProd.title
                          );

                          let value = opMatch
                            ? opMatch.option
                            : opProd.metadata.options[0];

                          if (opMatch.name.toLowerCase() === 'color') {
                            value = color;
                          }

                          return {
                            option_id: opProd.id,
                            value,
                          };
                        }
                      );
                      optionsByVariations.push(optionVariantSingle);
                    });
                  } else {
                    const optionVariantSingle = optionByProduct.map(
                      (opProd) => {
                        const opMatch = prodVar.attributes.find(
                          (e) => e.name === opProd.title
                        );
                        return {
                          option_id: opProd.id,
                          value: opMatch
                            ? opMatch.option
                            : opProd.metadata.options[0],
                        };
                      }
                    );
                    optionsByVariations.push(optionVariantSingle);
                  }

                  optionsByVariations.forEach((optionByVar, index) => {
                    newVariations.push({
                      title: optionByVar.map((item) => item.value).join(' / '),
                      prices: [
                        {
                          amount: helperService.parseAmountAndMultiply(
                            prodVar.price,
                            2,
                            100
                          ),
                          region_id: region.id,
                        },
                      ],
                      mid_code: colorsByVar[index] || null,
                      options: optionByVar,
                      sku: prodVar.sku,
                      inventory_quantity: 10000,
                      weight: prodVar.weight
                        ? helperService.parseAmountAndMultiply(
                            prodVar.weight,
                            3,
                            1000
                          )
                        : null,
                      length: prodVar.dimensions.length
                        ? helperService.parseAmountAndMultiply(
                            prodVar.dimensions.length,
                            3,
                            1000
                          )
                        : null,
                      height: prodVar.dimensions.height
                        ? helperService.parseAmountAndMultiply(
                            prodVar.dimensions.height,
                            3,
                            1000
                          )
                        : null,
                      width: prodVar.dimensions.width
                        ? helperService.parseAmountAndMultiply(
                            prodVar.dimensions.width,
                            3,
                            1000
                          )
                        : null,
                      metadata: prodVar,
                    });
                  });
                });

                const newSortVariations =
                  helperService.sortClothesSize(newVariations);

                await productVariantRepository
                  .createQueryBuilder()
                  .delete()
                  .where('product_id = :productId', { productId: prod.id })
                  .execute();

                for (const newProdVar of newSortVariations) {
                  await medusa.admin.products.createVariant(
                    prod.id,
                    newProdVar
                  );
                }

                prod.status = ProductStatus.PUBLISHED;
                await Promise.all([
                  medusa.admin.salesChannels.addProducts(saleChannel.id, {
                    product_ids: [
                      {
                        id: prod.id,
                      },
                    ],
                  }),
                  productRepository.save(prod),
                ]);
              }
            } catch (error) {
              console.log(
                `🚀 ~ ERROR REQUEST GET REQUEST VARIANT:: domain: ${prod.domain}, woo_product_id: ${prod.wooProductId}, id: ${prod.id}, message: ${error.message}`
              );
            }
          }
        }
      } catch (error) {
        console.log(`🚀 ~ ERROR UPDATE VARIANT PRODUCT:: ${error.message}`);
      }
    }
  );

  jobSchedulerService.create(
    'update-shipping-profile-for-products',
    {},
    '*/3 * * * *',
    async () => {
      const products = await productRepository.find({
        where: {
          wooProductId: Not(IsNull()),
          isAddShippingProfile: false,
        },
        limit: 100,
      });

      if (products.length) {
        const shippingProfile = await shippingProfileRepository.findOne({
          where: {
            type: 'default',
          },
        });
        const p = [];

        products.forEach((product) => {
          product.isAddShippingProfile = true;
          p.push(
            productShippingProfileRepository.save({
              profile_id: shippingProfile.id,
              product_id: product.id,
            }),
            productRepository.save(product)
          );
        });
        await Promise.all(p);
      }
    }
  );
};

export default wooSyncProduct;
