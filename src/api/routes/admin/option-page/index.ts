import { wrapHandler } from "@medusajs/utils";
import { Request, Response, Router } from "express";
import OptionPageService from "src/services/option-page";
const router = Router();

export default (adminRouter: Router) => {
    adminRouter.use("/option-page", router);

    router.post(
        "/",
        wrapHandler(async (req: Request, res: Response) => {
            const optionPage: OptionPageService = req.scope.resolve("optionPageService");
            const body = req.body
            if (!body.key || !body.value) {
                res.status(400).json({
                    message: 'Bad request, key and value is required',
                    status: 400,
                    code: 'BAD_REQUEST'
                });
            }
            res.json({
                data: await optionPage.create({ key: body.key, value: body.value }),
            });
        })
    );

    router.get(
        "/",
        wrapHandler(async (req: Request, res: Response) => {
            const optionPage: OptionPageService = req.scope.resolve("optionPageService");
            const { query } = req

            if (!query.limit || !query.offset) {
                res.status(400).json({
                    message: 'Bad request, limit and offset is required',
                    status: 400,
                    code: 'BAD_REQUEST'
                });
            }
            res.json({
                data: await optionPage.list({ limit: Number(query.limit), offset: Number(query.offset) }),
            });
        })
    );

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

    router.post(
        "/:key",
        wrapHandler(async (req: Request, res: Response) => {
            const optionPage: OptionPageService = req.scope.resolve("optionPageService");
            const { body } = req
            const { key } = req.params

            if (!key || !body) {
                res.status(400).json({
                    message: 'Bad request, key and value is required',
                    status: 400,
                    code: 'BAD_REQUEST'
                });
            }
            res.json({
                data: await optionPage.updateByKey(key, body),
            });
        })
    );
};
