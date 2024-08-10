import { wrapHandler } from "@medusajs/utils";
import { Request, Response, Router } from "express";
import OptionPageService from "src/services/option-page";
const router = Router();

export default (storeRouter: Router) => {
    storeRouter.use("/option-page", router);

    router.get(
        "/find-by-key",
        wrapHandler(async (req: Request, res: Response) => {
            const optionPage: OptionPageService = req.scope.resolve("optionPageService");
            const { query } = req

            if (!query.keys || !Array.isArray(query.keys)) {
                res.status(400).json({
                    message: 'Bad request, keys must be array string',
                    status: 400,
                    code: 'BAD_REQUEST'
                });
            }
            res.json({
                data: await optionPage.findByKey(query.keys as string[]),
            });
        })
    );
};
