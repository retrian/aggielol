/**  backend/verifyToken.js  (CommonJS so it works in every Node setup) */
import admin from "./firebaseAdmin.js";

export async function verifyToken(req, res, next) {
  // Expect:  Authorization: Bearer <idToken>
  const authHeader = req.headers.authorization || "";
  const [, token]  = authHeader.split(" ");

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;           // uid, email, etc.
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
}
