/* eslint-disable prefer-destructuring */
import { onRequest } from "firebase-functions/v2/https";
import type { ShopifyApp } from "@shopify/shopify-app-express";
import app from "./express";
import getShopifyApp from "./shopify";

let shopify: ShopifyApp;

export default onRequest((req, res) => {
  if (!shopify) {
    shopify = getShopifyApp();
  }

  app.post(
    shopify.config.webhooks.path,
    shopify.processWebhooks({
      webhookHandlers: {},
    })
  );

  return app(req, res);
});
