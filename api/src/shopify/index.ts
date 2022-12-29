/* eslint-disable prefer-destructuring */
import { ApiVersion } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { restResources } from "@shopify/shopify-api/rest/admin/2022-10";
import invariant from "tiny-invariant";
import { FirestoreSessionStorage } from "../firebase/session-storage";
import { db } from "../firebase";
import logger from "./logger";

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY, HOST_NAME } = process.env;

console.log("api-key", SHOPIFY_API_KEY);
console.log("api-secret-key", SHOPIFY_API_SECRET_KEY);
console.log("host-name", HOST_NAME);

export default function getShopifyApp() {
  invariant(SHOPIFY_API_KEY != null, "SHOPIFY_API_KEY env var must be defined");
  invariant(
    SHOPIFY_API_SECRET_KEY != null,
    "SHOPIFY_API_SECRET_KEY env var must be defined"
  );

  return shopifyApp({
    api: {
      apiVersion: ApiVersion.October22,
      restResources,
      logger: {
        log: logger,
      },
      apiKey: SHOPIFY_API_KEY,
      apiSecretKey: SHOPIFY_API_SECRET_KEY,
      scopes: ["write_products"],
      hostName: HOST_NAME,
    },
    auth: {
      path: "/api/auth",
      callbackPath: "/api/auth/callback",
    },
    webhooks: {
      path: "/api/webhooks",
    },
    // This should be replaced with your preferred storage strategy
    sessionStorage: new FirestoreSessionStorage(db),
  });
}
