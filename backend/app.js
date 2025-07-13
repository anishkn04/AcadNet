import express from "express";
import { logger } from "./middlewares/middlewares.js";
import authRouter from "./routes/authrouter.js";
import dataRouter from "./routes/datarouter.js";
import passport from "passport";
import "./passport/passport.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path from 'path';
import groupRouter from "./routes/grouprouter.js";
import forumRouter from "./routes/forumrouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:3000", "http://127.0.0.1:3000"];
const PORT = process.env.BACKEND_PORT || 3000;

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'AcadNet',
      version: '1.0.0',
      description: 'API documentation for AcadNet',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
        csrfToken: {
          type: 'apiKey',
          in: 'header',
          name: 'X-CSRF-Token',
        },
      },
    },
  },
  apis: [__dirname + '/routes/*.js'], // Path to your API docs
};

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cookieParser());
app.use(express.json());
app.use(logger);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/data", dataRouter);
app.use("/api/v1/group",groupRouter)
app.use("/api/v1/forum", forumRouter);

app.use(passport.initialize());

// Add a simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
