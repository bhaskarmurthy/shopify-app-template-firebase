/* eslint-disable prefer-destructuring */
import express, { Request, Response } from "express";
import { onRequest } from "firebase-functions/v2/https";
import type { ShopifyApp } from "@shopify/shopify-app-express";
import getShopifyApp from "./shopify";
import app from "./express";
import productCreator from "./shopify/product-creator";

let shopify: ShopifyApp;

const createProductHandler = async (req: Request, res: Response) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(shopify, res.locals.shopify.session);
  } catch (e: any) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
};

const countProductsHandler = async (req: Request, res: Response) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
};

export default onRequest((req, res) => {
  if (!shopify) {
    shopify = getShopifyApp();
  }

  app.use("/api/*", shopify.validateAuthenticatedSession());
  app.use(express.json());

  app.get("/api/products/count", countProductsHandler);
  app.get("/api/products/create", createProductHandler);

  return app(req, res);
});
