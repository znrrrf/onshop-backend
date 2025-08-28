import {Router, Request, Response} from "express";
import {pool} from "../config/db";
import dotenv from 'dotenv';
dotenv.config();
const router = Router();

// contoh route GET
router.get('/users', async (req: Request, res: Response) => {
 try {
    console.log("database :", process.env.DATABASE_URL)
    const result = await pool.query('SELECT * FROM "Users" LIMIT 10');
    console.log("result :", result)
    res.json(result.rows); // kirim hasil query
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data user" });
  }
});

// contoh route POST
router.post('/create', (req: Request, res: Response) => {
  const { name } = req.body;
  res.send(`User ${name} berhasil dibuat`);
});

export default router;