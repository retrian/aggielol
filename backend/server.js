/**  backend/server.js  */
import express from "express";
import cors from "cors";
import { verifyToken } from "./verifyToken.js";

const app = express();
app.use(cors());          // allow localhost:5173 in dev
app.use(express.json());  // parse JSON bodies

app.get("/api/hello", (req, res) => {
  res.json({ msg: "Public route works" });
});

// 🔒 Example protected route
app.post("/api/predictions", verifyToken, (req, res) => {
  console.log("User info on req.user:", req.user);
  res.json({ ok: true, uid: req.user.uid });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));

