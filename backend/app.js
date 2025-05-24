import express from 'express';
import { logger } from './middlewares/middlewares.js';

const app = express()
app.use(logger)


export default app