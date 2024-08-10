import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { wrapHandler } from "@medusajs/utils";
import axios from "axios";
import crypto from 'crypto';
import { Router } from "express";
import AnalyticsSettingService from "src/services/analytics-setting";
import { v4 as uuidv4 } from 'uuid';
const router = Router();

const hashData = (data: string) => {
  return crypto.createHash('sha256').update(data).digest('hex');
}

interface ReqType extends MedusaRequest {
  session?: any;
  body: {
    user_data: {
      email?: string
      phone?: string
      firstName?: string
      lastName?: string
    }
    custom_data: any
    event_source_url: string
  }
}
export default (storeRouter: Router) => {
  storeRouter.use("/track-event", router);

  router.post(
    "/:event",
    wrapHandler(async (req: any, res: MedusaResponse) => {
      try {
        const body = req.body
        const eventName = req.params.event
        const client_user_agent = req.headers['user-agent'];
        const client_ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const analyticsSettingService: AnalyticsSettingService =
          req.scope.resolve('analyticsSettingService');
        const analyticsSetting = await analyticsSettingService.retrieve()
        const [id_provider, access_token] = [
          analyticsSetting?.find((e) => e.provider === "Meta Pixel"),
          analyticsSetting?.find((e) => e.provider === "Meta Pixel Token"),
        ]

        const event = {
          data: [{
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: uuidv4(),
            user_data: {
              em: body.user_data?.email ? [hashData(body.user_data.email)] : [null],
              ph: body.user_data?.phone ? [hashData(body.user_data.phone)] : [null],
              fn: body.user_data?.firstName ? [hashData(body.user_data.firstName)] : [null],
              ln: body.user_data?.lastName ? [hashData(body.user_data.lastName)] : [null],
              client_user_agent: client_user_agent,
              client_ip_address: client_ip_address
            },
            custom_data: {
              ...body.custom_data
            },
            action_source: 'website',
            event_source_url: body.event_source_url,
          }]
        };

        const response = await axios.post(`https://graph.facebook.com/v20.0/${id_provider?.id_provider}/events`, JSON.stringify(event), {
          params: {
            access_token: access_token?.id_provider
          },
          headers: {
            'Content-Type': 'application/json'
          }
        })
        res.json({ data: response.data });
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
