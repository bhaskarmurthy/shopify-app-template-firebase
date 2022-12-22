/* eslint-disable import/prefer-default-export */
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";

export const helloworld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
