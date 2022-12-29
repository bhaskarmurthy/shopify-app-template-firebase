/* eslint-disable prefer-destructuring */
import { onRequest } from "firebase-functions/v2/https";
import { RestResources } from "@shopify/shopify-api/rest/admin/2022-10";
import { ShopifyApp } from "@shopify/shopify-app-express";
import getShopifyApp from "./shopify";
import app from "./express";
import { FirestoreSessionStorage } from "./firebase/session-storage";

let shopify: ShopifyApp<RestResources, FirestoreSessionStorage>;

export default onRequest((req, res) => {
  if (!shopify) {
    shopify = getShopifyApp();
  }

  app.get(shopify.config.auth.path, shopify.auth.begin());
  app.get(
    shopify.config.auth.callbackPath,
    shopify.auth.callback(),
    shopify.redirectToShopifyOrAppRoot()
  );

  return app(req, res);
});
