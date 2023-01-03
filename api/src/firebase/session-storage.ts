/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Firestore, FirestoreDataConverter } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { SessionStorage } from "@shopify/shopify-app-session-storage";
import { Session, SessionParams } from "@shopify/shopify-api";

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
    return this.sessionsCollection
      .doc(id)
      .delete()
      .then((result) => {
        logger.info(`Deleted session with id ${id}`);
        return true;
      })
      .catch((error) => {
        logger.error(`Error deleting session with id ${id}`, error);
        return false;
      });
  }

  deleteSessions(ids: string[]): Promise<boolean> {
    return Promise.allSettled(
      ids.map((id) => this.sessionsCollection.doc(id).delete())
    )
      .then((results) => {
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            logger.info(`Deleted session with id ${ids[index]}`);
          }
        });

        return true;
      })
      .catch((error) => {
        logger.error(
          `Error deleting sessions with ids ${ids.toString()}`,
          error
        );
        return false;
      });
  }

  findSessionsByShop(shop: string): Promise<Session[]> {
    return this.sessionsCollection
      .where("shop", "==", shop)
      .get()
      .then((snap) => snap.docs.map((doc) => new Session(doc.data())))
      .catch((error) => {
        logger.error(`Error getting session for shop ${shop}`, error);
        return [];
      });
  }
}
