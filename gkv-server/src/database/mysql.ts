// src/db/mysql.ts
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const mysqlDB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, // changed from `username`
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
