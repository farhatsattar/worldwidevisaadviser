const path = require("path");
const firebaseAdmin = require("firebase-admin");

/**
 * Initialize Firebase Admin once and expose Firestore.
 * Use either FIREBASE_SERVICE_ACCOUNT_PATH (file) or FIREBASE_SERVICE_ACCOUNT_JSON (string).
 */
function initializeFirebaseAdmin() {
  if (firebaseAdmin.apps.length > 0) {
    return firebaseAdmin;
  }

  const jsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const pathEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (jsonEnv) {
    const credentials = JSON.parse(jsonEnv);
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(credentials),
    });
  } else if (pathEnv) {
    const resolved = path.isAbsolute(pathEnv)
      ? pathEnv
      : path.resolve(process.cwd(), pathEnv);
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const serviceAccount = require(resolved);
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
    });
  } else {
    throw new Error(
      "Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in .env",
    );
  }

  return firebaseAdmin;
}

const admin = initializeFirebaseAdmin();
const db = admin.firestore();

module.exports = {
  admin,
  db,
};
