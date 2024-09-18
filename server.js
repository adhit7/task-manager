import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

connectDB();

const app = express();

const corsOptions = {
  origin: 'https://task-manager-production.vercel.app',
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Task Manager API is running....');
});

app.use('/user', userRoutes);
app.use('/task', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
