import { wrapHandler } from "@medusajs/utils";
import { Router, query } from "express";
import SESService from "../../../../services/ses";
import process from "node:process";
const router = Router();

export default (storeRouter: Router) => {
  storeRouter.use("/customer", router);

  router.post(
    "/contact",
    wrapHandler(async (req: any, res: any) => {
        const sesService: SESService = req.scope.resolve('sesService');
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const data = {
            name,
            email,
            phone,
            message
        };

        try {
            await sesService.sendEmail("contact", process.env.SES_FROM, "info@vincoleggings.com", data);
            res.status(200).json({ success: true, message: "Email sent successfully." });
        } catch (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ success: false, message: "Failed to send email." });
        }
    })
  );
};
