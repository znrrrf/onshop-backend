// 2️⃣ Library eksternal
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import testRoute from './routers/testRoute'
import userRouters from './routers/users'

const PORT = 8100;
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/test', testRoute);
app.use('/api/user', userRouters);

app.get('/api', (req: any, res: any) => {
    res.send("Hi, this is my api");
});

app.listen(PORT, () => {
    console.log("Server is running on PORT : " + PORT)
})

