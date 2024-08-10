import { MedusaRequest, MedusaResponse, ProductService, ProductVariantService } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import ProductV2Service from "src/services/product-v2";
import { MedusaError } from "medusa-core-utils";
import { CreateProductProductVariantPriceInput } from "@medusajs/medusa/dist/types/product";
import ProductOptionValueService from "src/services/product-option-value";
const router = Router();
interface ReqType extends MedusaRequest {
    session?: any;
}

export default (adminRouter: Router) => {
    adminRouter.use("/products-v2", router);

    router.post(
        "/",
        wrapHandler(async (req: any, res: MedusaResponse) => {
            try {
                const { productIds } = req.body

                if (!Array.isArray(productIds)) {
                    res.status(400).json({
                        status: 'Error',
                        message: "ProductIds must be an array"
                    });
                }

                const productService: ProductV2Service = req.scope.resolve("productV2Service");
                const returnResult = await productService.deleteMany(productIds)

                if (returnResult) {
                    res.status(200).json({
                        status: 'Success',
                        message: "Delete successfully"
                    });
                }
            } catch (err) {
                res.status(400).json({
                    status: 'Error',
                    message: err
                });
            }
        })
    );

    router.post(
        "/:id/variants/create",
        wrapHandler(async (req: any, res: MedusaResponse) => {
            try {
                const { id } = req.params
                // const { options, prices } = req.body
                const body = req.body

                const productService: ProductService = req.scope.resolve("productService");
                const productVariantService: ProductVariantService = req.scope.resolve("productVariantService");
                // const productOptionValueService: ProductOptionValueService = req.scope.resolve("productOptionValueService")

                const isProduct = await productService.retrieve(id)
                if (!isProduct)
                    res.status(400).json({
                        status: 'Error',
                        message: "Product not found"
                    });

                const data = await productVariantService.create(id, body)
                res.status(200).json({
                    status: 'Create successfully',
                    data
                });
            } catch (err) {
                console.log("🚀 => wrapHandler => err:", err)
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
            }
        })
    )

    router.post(
        "/:id/variants/update",
        wrapHandler(async (req: any, res: MedusaResponse) => {
            try {
                // const { id } = req.params
                const { options, variant_id } = req.body
                const body = req.body
                delete body.variant_id

                const productVariantService: ProductVariantService = req.scope.resolve("productVariantService");
                const productOptionValueService: ProductOptionValueService = req.scope.resolve("productOptionValueService")

                await productVariantService.update({ id: variant_id }, body)
                await productOptionValueService.changeMultiMetadata(variant_id, options)

                res.status(200).json({
                    message: "Update successfully"
                })

            } catch (err) {
                throw new MedusaError(MedusaError.Types.NOT_FOUND, "Some thing went wrong");
            }
        })
    )
}