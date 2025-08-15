import mysql, { Pool, PoolOptions } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

console.log("DB CFG =>", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  db: process.env.DB_NAME
});


const sslMode = (process.env.DB_SSL_MODE || "DISABLED").toUpperCase();

const baseCfg: PoolOptions = {
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  //allowPublicKeyRetrieval: true
};


const db: Pool =
  sslMode === "REQUIRED"
    ? mysql.createPool({ ...baseCfg, ssl: { rejectUnauthorized: false } })
    : mysql.createPool(baseCfg);

export default db;
