import { MedusaRequest, MedusaResponse, RegionService } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import axios from "axios";
const router = Router();
interface ReqType extends MedusaRequest {
  session?: any;
}
export default (storeRouter: Router) => {
  storeRouter.use("/suggest", router);

  router.post(
    "/",
    wrapHandler(async (req: ReqType, res: MedusaResponse) => {
      try {
        const { input, components } = req.body;
        const response = await axios.get(
          "https://maps.googleapis.com/maps/api/place/autocomplete/json",
          {
            params: {
              input,
              key: process.env.GOOGLE_MAP_API_KEY,
              components,
            },
          }
        );
        res.status(200).json(response.data);
      } catch (error) {
        res
          .status(error.response?.status || 500)
          .json({ error: error.message });
      }
    })
  );
};
