import * as admin from 'firebase-admin';
import config from '../config';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('firebase');

let app: admin.app.App | null = null;

export function getFirebaseApp(): admin.app.App {
  if (app) return app;

  const { projectId, clientEmail, privateKey } = config.firebase;

  if (projectId && clientEmail && privateKey) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    logger.info('Firebase Admin SDK initialized with service account', { projectId });
  } else {
    // Fallback: application default credentials (e.g. GCP / Cloud Run)
    app = admin.initializeApp();
    logger.info('Firebase Admin SDK initialized with application default credentials');
  }

  return app;
}

export async function verifyFirebaseToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  const auth = getFirebaseApp().auth();
  return auth.verifyIdToken(idToken);
}
