import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import { MedusaError } from "medusa-core-utils";
import ProductV2Service from "src/services/product-v2";
const router = Router();
interface ReqType extends MedusaRequest {
    session?: any;
}

export default (storeRouter: Router) => {
    storeRouter.use("/products-v2", router);

    router.get(
        "/",
        wrapHandler(async (req: any, res: MedusaResponse) => {
            try {
                const { limit, offset, q } = req.query

                const limitNumber = parseInt(limit as string, 10);
                const offsetNumber = parseInt(offset as string, 10);

                const productService: ProductV2Service = req.scope.resolve("productV2Service");
                const cacheService = req.scope.resolve("cacheService")

                const isProductsCache = await cacheService.get('products');

                if (!isProductsCache) {
                    try {
                        const result = await productService.listProducts(limitNumber || 11, offsetNumber || 0, q?.toString() || "")
                        await cacheService.set('products', result)
                        res.json({ products: result, count: result.length, offset: 0 });
                    } catch (error) {
                        console.error('Error setting cache:', error);
                    }
                } else {
                    res.json({ products: isProductsCache, count: isProductsCache.length, offset: 0 });
                }

            } catch (err) {
                console.log("🚀 => wrapHandler => err:", err)
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
            }
        })
    );

    router.get(
        "/:product_id",
        wrapHandler(async (req: any, res: MedusaResponse) => {
            try {
                const { product_id } = req.params

                const productService: ProductV2Service = req.scope.resolve("productV2Service");

                const data = await productService.retrieve(product_id)
                res.json({ products: data, count: data.length, offset: 0 });
            } catch (err) {
                console.log("🚀 => wrapHandler => err:", err)
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
            }
        })
    )

    router.get(
        "/handle/:handle",
        wrapHandler(async (req: any, res: MedusaResponse) => {
            try {
                const { handle } = req.params
                console.log(handle);


                const productService: ProductV2Service = req.scope.resolve("productV2Service");

                const data = await productService.getByHandle(handle)
                res.json({ products: data, count: data.length, offset: 0 });
            } catch (err) {
                console.log("🚀 => wrapHandler => err:", err)
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
            }
        })
    )
}