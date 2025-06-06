import express from 'express';
import { logger } from './middlewares/middlewares.js';
import authRouter from './routes/authrouter.js';
import passport from 'passport';
import './passport/passport.js'
import cookieParser from 'cookie-parser';

const app = express()
app.use(express.json())
app.use(logger)
app.use('/api/v1/auth',authRouter)
app.use(cookieParser())
app.use(passport.initialize());

export default app