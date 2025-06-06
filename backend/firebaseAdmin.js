// backend/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";

const serviceJson = JSON.parse(
  fs.readFileSync(new URL("./keys/serviceAccount.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceJson),
});

export default admin;
