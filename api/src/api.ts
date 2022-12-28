/* eslint-disable prefer-destructuring */
import { onRequest } from "firebase-functions/v2/https";
import type { Express } from "express";
import getApp from "./shopify/app";

let app: Express;

export default onRequest((req, res) => {
  if (!app) {
    app = getApp();
  }

  return app(req, res);
});
