import { ProductStatus } from "@medusajs/medusa";
import { AwilixContainer } from "awilix";
import { IsNull, Not } from "typeorm";
import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";

export const contentGoogle = () => {
  const keyFilePath = path.join(process?.cwd(), process?.env?.GOOGLE_KEY_FILE);
  if (!fs.existsSync(keyFilePath)) {
    throw new Error("GOOGLE SERVICE KEY NOT FOUND");
  }
  const creds = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ["https://www.googleapis.com/auth/content"],
  });

  return google.content({ version: "v2.1", auth: creds });
};

const feedProductForGoogleMerchant = async (container: AwilixContainer, options: Record<string, any>) => {
  if (process.env.FEED_PRODUCT_FOR_GOOGLE_MERCHANT !== "true") {
    return;
  }

  const jobSchedulerService = container.resolve("jobSchedulerService");
  const productRepository = container.resolve("productRepository");
  const productService = container.resolve("productService");
  const googleMerchantSettingService = container.resolve("googleMerchantSettingService");

  jobSchedulerService.create("sync-feed-product-for-google-merchant", {}, "*/2 * * * *", async () => {
    try {
      const googleMerchantSetting = await googleMerchantSettingService.retrieve();
      if (!googleMerchantSetting.merchant_id) {
      }
      const content = contentGoogle();

      const products = await productRepository.find({
        where: {
          wooProductId: Not(IsNull()),
          status: ProductStatus.PUBLISHED,
          isSyncFeedForGoogleMerchant: false,
          syncToMerchant: true,
        },
        limit: 5,
      });

      if (products.length) {
        for (const prod of products) {
          const product = await productService.retrieve(prod.id, {
            relations: ["variants", "variants.prices"],
          });

          for await (const variant of product.variants) {
            let data: any = {
              merchantId: googleMerchantSetting?.merchant_id,
              requestBody: {
                channel: "online",
                contentLanguage: "en",
                color: variant?.mid_code,
                kind: "content#product",
                brand: product?.domain?.split(".")?.[0],
                additionalImageLinks: product?.images?.map((e) => e.url),
                lifestyleImageLinks: product?.images?.map((e) => e.url),
                adsRedirect: `${process.env.STORE_URL}/products/${product?.handle}`,
                availability: "in_stock",
                canonicalLink: `${process.env.STORE_URL}/products/${product?.handle}`,
                description: product?.description,
                id: variant?.id,
                offerId: variant?.id,
                itemGroupId: variant?.sku || product?.id,
                identifierExists: true,
                imageLink: product?.thumbnail,
                link: `${process.env.STORE_URL}/products/${product?.handle}`,
                linkTemplate: `${process.env.STORE_URL}/products/${product?.handle}`,
                material: "",
                mobileLink: `${process.env.STORE_URL}/products/${product?.handle}`,
                mobileLinkTemplate: `${process.env.STORE_URL}/products/${product?.handle}`,
                // feedLabel: ,
                // gtin:,
                // costOfGoodsSold: {
                //   currency: 'USD',
                //   value: '50',
                // },
                // taxes?: Schema$ProductTax[];
                price: {
                  currency: "USD",
                  value: (variant?.prices[0]?.amount / 100).toString(),
                },
                salePrice: {
                  currency: "USD",
                  value: (variant?.prices[0]?.amount / 100).toString(),
                },
                sizes: [variant?.title],
                sizeSystem: variant?.title,
                title: product?.title,
                targetCountry: "NA",
              },
            };
            if (product?.weight) {
              data.productWeight = {
                unit: "g",
                value: product?.weight,
              };
            }
            if (product?.length) {
              data.productLength = {
                unit: "cm",
                value: product?.length,
              };
            }
            if (product?.height) {
              data.productHeight = {
                unit: "cm",
                value: product?.height,
              };
            }
            if (product?.width) {
              data.productWidth = {
                unit: "cm",
                value: product?.width,
              };
            }
            try {
              await content.products.insert(data);
            } catch (error) {
            }
          }

          await productRepository.save({ id: product.id, isSyncFeedForGoogleMerchant: true });
        }
      }

      return true;
    } catch (error) {
    }
  });

  //update feed every 24h
  jobSchedulerService.create("reset-feed-every-24h", {}, "0 0-23/24 * * *", async () => {
    try {
      await productRepository.update(
        {
          wooProductId: Not(IsNull()),
        },
        { isSyncFeedForGoogleMerchant: false }
      );
    } catch (error) {
    }
  });
};

export default feedProductForGoogleMerchant;
