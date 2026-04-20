import * as admin from 'firebase-admin';
import config from '../config/index.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('firebase');

let app: admin.app.App | null = null;

export function getFirebaseApp(): admin.app.App {
  if (app) return app;

  const { projectId, clientEmail, privateKey } = config.firebase;
  // If any service-account fields are provided, require them all —
  // partial config leads to confusing errors from the SDK (reading 'cert').
  const hasAnyServiceAccountField = Boolean(projectId || clientEmail || privateKey);
  const hasAllServiceAccountFields = Boolean(projectId && clientEmail && privateKey);

  if (hasAnyServiceAccountField && !hasAllServiceAccountFields) {
    throw new Error(
      'Incomplete Firebase service account configuration: please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (or leave all blank to use application default credentials)'
    );
  }

  if (hasAllServiceAccountFields) {
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
  try {
    const auth = getFirebaseApp().auth();
    return await auth.verifyIdToken(idToken);
  } catch (err: any) {
    logger.error('Firebase token verification failed', { message: err?.message, stack: err?.stack });
    throw new Error(`Firebase token verification failed: ${err?.message}`);
  }
}
