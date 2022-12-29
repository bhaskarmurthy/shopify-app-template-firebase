/* eslint-disable prefer-destructuring */
import type { Request, Response } from "express";
import { onRequest } from "firebase-functions/v2/https";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ShopifyApp } from "@shopify/shopify-app-express";
import getShopifyApp from "./shopify";
import app from "./express";

let shopify: ShopifyApp;
const indexHtml = readFileSync(resolve(__dirname, "./index.html"), "utf-8");

const appMiddleware = async (req: Request, res: Response) =>
  res.status(200).set("Content-Type", "text/html").send(indexHtml);

export default onRequest((req, res) => {
  if (!shopify) {
    shopify = getShopifyApp();
  }

  app.get("*", shopify.ensureInstalledOnShop(), appMiddleware);

  return app(req, res);
});
