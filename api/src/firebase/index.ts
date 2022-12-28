/* eslint-disable import/prefer-default-export */
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp();
export const db = getFirestore(app);

db.settings({
  ignoreUndefinedProperties: true,
});
