import { MedusaRequest, MedusaResponse, wrapHandler } from "@medusajs/medusa";
import { Router } from "express";
import ProductTypeV2Service, { TSetMetadataPayload } from "src/services/product-type-v2";
const router = Router();

interface ReqType extends MedusaRequest {
    session?: any;
}

export default (adminRouter: Router) => {
    adminRouter.use("/product-type-v2", router);

    router.get('/', wrapHandler(async (req: ReqType, res: MedusaResponse) => {
        try {
            const { limit, offset } = req.query;

            const typesService: ProductTypeV2Service = req.scope.resolve(
                "productTypeV2Service"
            );
            const result = await typesService.getProductTypes({ limit: Number(limit), offset: Number(offset) });

            res.status(200).json({
                status: "Success",
                message: "Get product types successfully",
                data: {
                    product_types: result[0],
                    count: result[1]
                }
            });
        } catch (error) {
            res.status(error?.status || 500).json({
                message: error?.message,
                status: error?.status,
                code: error?.code
            });
        }
    }))
    router.post(
        "/update",
        wrapHandler(async (req: ReqType, res: MedusaResponse) => {
            try {
                const { types }: { types: TSetMetadataPayload[] } = req.body;

                const typesService: ProductTypeV2Service = req.scope.resolve(
                    "productTypeV2Service"
                );
                await typesService.setProductTypesMetadata(types);

                res.status(200).json({
                    status: "Success",
                    message: "Update successfully",
                });
            } catch (error) {
                res.status(error?.status || 500).json({
                    message: error?.message,
                    status: error?.status,
                    code: error?.code
                });
            }
        })
    );
};
