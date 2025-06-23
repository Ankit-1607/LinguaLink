import express from 'express';
import "dotenv/config";
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import connectDB from './db/connect.db.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}....`);
  connectDB(process.env.MONGO_URI);
})