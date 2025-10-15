import admin from "firebase-admin";
import serviceAccountKey from "../../serviceAccountKey.json";

// init admin firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
  });
}

export { admin }