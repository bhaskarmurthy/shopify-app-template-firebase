/* eslint-disable import/prefer-default-export */
import { Firestore, FirestoreDataConverter } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { SessionStorage } from "@shopify/shopify-app-session-storage";
import { Session, SessionParams } from "@shopify/shopify-api";

console.log("FIRESTORE_EMULATOR_HOST", process.env.FIRESTORE_EMULATOR_HOST);

const sessionStorageConverter: FirestoreDataConverter<SessionParams> = {
  toFirestore(
    session: FirebaseFirestore.WithFieldValue<SessionParams>
  ): FirebaseFirestore.DocumentData {
    return {
      id: session.id,
      shop: session.shop,
      state: session.state,
      isOnline: session.isOnline,
      accessToken: session.accessToken,
      expires: session.expires,
      scope: session.scope,
    };
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
  ): SessionParams {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      shop: data.shop,
      state: data.state,
      isOnline: data.isOnline,
      accessToken: data.accessToken,
      expires: data.expires,
      scope: data.scope,
    };
  },
};

export class FirestoreSessionStorage implements SessionStorage {
  sessionsCollection: FirebaseFirestore.CollectionReference<SessionParams>;

  constructor(db: Firestore) {
    this.sessionsCollection = db
      .collection("sessions")
      .withConverter(sessionStorageConverter);
  }

  storeSession(session: Session): Promise<boolean> {
    return this.sessionsCollection
      .add(session.toObject())
      .then((result) => {
        logger.info(`Saved session with id ${result.id}`);
        return true;
      })
      .catch((error) => {
        logger.error(`Unable to save session with id ${session.id}`, error);
        return false;
      });
  }

  loadSession(id: string): Promise<Session | undefined> {
    return this.sessionsCollection
      .doc(id)
      .get()
      .then((snap) => {
        const data = snap.data();

        if (data !== undefined) {
          logger.info(`Loaded session with id ${id}`);
          return new Session(data);
        }

        // no document found
        logger.warn(`Unable to find session with id ${id}`);
        return undefined;
      })
      .catch((error) => {
        logger.error(`Error loading session with id ${id}`, error);
        return undefined;
      });
  }

  deleteSession(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  deleteSessions(ids: string[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  findSessionsByShop(shop: string): Promise<Session[]> {
    throw new Error("Method not implemented.");
  }
}
