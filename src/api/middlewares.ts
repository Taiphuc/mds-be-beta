import type { MiddlewaresConfig } from "@medusajs/medusa";
import express from "express";
import * as cors from "cors"

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/uploads",
      middlewares: [express.static(process.env.PUBLIC_PATH)],
    },
    {
      matcher: "/printful/webhook*",
      middlewares: [
        cors({
          origin: "https://api.printful.com",
        }),
      ],
    }
  ],
};
