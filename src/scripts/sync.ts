// src/scripts/sync.ts
import { sequelize } from "../models";  // ini penting, harus dari models/index.ts

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync({ force: true }); // paksa bikin ulang semua tabel
    console.log("✅ Models synced");

    console.log("Registered models:", Object.keys(sequelize.models));
  } catch (err) {
    console.error("DB connection error", err);
  }
}

start();
