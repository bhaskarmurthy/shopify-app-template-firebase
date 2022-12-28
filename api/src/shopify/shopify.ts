/* eslint-disable prefer-destructuring */
import { ApiVersion } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { restResources } from "@shopify/shopify-api/rest/admin/2022-10";
import { FirestoreSessionStorage } from "../firebase/session-storage";
import { db } from "../firebase";
import logger from "./logger";

export default function getShopifyApp(
  apiKey: string,
  apiSecretKey: string,
  hostName?: string
) {
  return shopifyApp({
    api: {
      apiVersion: ApiVersion.October22,
      restResources,
      logger: {
        log: logger,
      },
      apiKey,
      apiSecretKey,
      scopes: ["write_products"],
      hostName,
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
