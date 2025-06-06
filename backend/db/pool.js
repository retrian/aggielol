// vite-project/backend/db/pool.js
import pg from 'pg';
import 'dotenv/config';        // loads .env once for every backend script

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
       ? { rejectUnauthorized: false }
       : false
});
