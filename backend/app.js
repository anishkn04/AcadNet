import express from 'express';
import { logger } from './middlewares/middlewares.js';
import authRouter from './routes/authrouter.js';
const app = express()
app.use(express.json())
app.use(logger)
app.use(express.json())
app.use('/api/v1/auth',authRouter)

export default app