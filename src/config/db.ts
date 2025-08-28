import pkg from 'pg';
import dotenv from 'dotenv';
import { Sequelize } from "sequelize";

dotenv.config();
const { Pool } = pkg;

const username: string | undefined = process.env.DB_USERNAME;
const password: string | undefined = process.env.DB_PASSWORD;
const host: string | undefined = process.env.DB_HOST;
const port: string | undefined = process.env.DB_PORT;
const database: string | undefined = process.env.DB_DATABASE;
const sslEnabled = process.env.DB_SSL === "true";

// Connection string (pg & Sequelize bisa pakai sama)
const connection: string = `postgresql://${username ?? ''}:${password ?? ''}@${host ?? ''}${port ?  ':' + port : ''}/${database ?? ''}`

console.log("check connection :", connection);

// Pool untuk raw query
const pool = new Pool({
  connectionString: connection,
  ssl: sslEnabled
    ? { rejectUnauthorized: false }
    : false,
});

// Sequelize instance untuk ORM / raw query via Sequelize
const sequelize = new Sequelize(connection, {
  dialect: "postgres",
  logging: false,
  dialectOptions: sslEnabled ? { ssl: { require: true, rejectUnauthorized: false } } : {}
});

export { pool, sequelize };
