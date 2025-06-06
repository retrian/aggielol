// src/middleware/isAdmin.js
import jwt from 'jsonwebtoken';

export default function isAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Missing authorization header');
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Missing token');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.isAdmin) return res.status(403).send('Forbidden');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).send('Invalid or expired token');
  }
}
