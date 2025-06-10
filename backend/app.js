import express from 'express';
import { logger } from './middlewares/middlewares.js';
import authRouter from './routes/authrouter.js';
import passport from 'passport';
import './passport/passport.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';


const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];


const app = express()
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(cookieParser())
app.use(express.json())
app.use(logger)
app.use('/api/v1/auth',authRouter)
app.use(passport.initialize());

export default app