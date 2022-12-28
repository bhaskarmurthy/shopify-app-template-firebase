import { logger } from "firebase-functions/v2";
import express from "express";
import morgan from "morgan";
import invariant from "tiny-invariant";
import shopifyApp from "./shopify";

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY, HOST_NAME } = process.env;

console.log("api-key", SHOPIFY_API_KEY);
console.log("api-secret-key", SHOPIFY_API_SECRET_KEY);
console.log("host-name", HOST_NAME);

export default function getApp() {
  invariant(SHOPIFY_API_KEY != null, "SHOPIFY_API_KEY env var must be defined");
  invariant(
    SHOPIFY_API_SECRET_KEY != null,
    "SHOPIFY_API_SECRET_KEY env var must be defined"
  );

  const shopify = shopifyApp(
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET_KEY,
    HOST_NAME
  );
  const app = express();

  // setup logger
  app.use(
    morgan("combined", {
      stream: {
        write: logger.log,
      },
    })
  );

  app.get(shopify.config.auth.path, shopify.auth.begin());
  app.get(
    shopify.config.auth.callbackPath,
    shopify.auth.callback(),
    shopify.redirectToShopifyOrAppRoot()
  );
  app.post(
    shopify.config.webhooks.path,
    shopify.processWebhooks({
      webhookHandlers: {},
    })
  );

  return app;
}
