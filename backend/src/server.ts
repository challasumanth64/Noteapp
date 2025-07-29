import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';

// --- IMPORT YOUR ROUTE FILES ---
import authRoutes from './routes/auth';
import noteRoutes from './routes/notes';

dotenv.config();

const app = express();

// --- MIDDLEWARE ---
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Allow specific origin
  credentials: true,
}));
app.use(express.json());

// --- API ROUTES ---
// All auth-related routes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);
// All note-related routes will be prefixed with /api/notes
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err: any) => console.error('❌ MongoDB connection error:', err));