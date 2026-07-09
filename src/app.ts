/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import cors from 'cors';
import mongoose from 'mongoose';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import config from './app/config';
import routes from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';


const app: Application = express();
app.use(
  cors({
    origin: [
      'https://gardening-tips-platform-client-six.vercel.app',
      'https://gardening-tips-platform-client-d62ibml2c.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  })
);

// DB connection gate — placed after cors() so every response (including
// failures) still gets Access-Control-Allow-Origin; otherwise a DB outage
// looks like a CORS error in the browser instead of the real 503.
let connectionPromise: Promise<typeof mongoose> | null = null;

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!connectionPromise || mongoose.connection.readyState === 0) {
    connectionPromise = mongoose.connect(config.db_url as string, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      socketTimeoutMS: 8000,
    });
    connectionPromise.catch(() => {
      connectionPromise = null;
    });
  }

  connectionPromise
    .then(() => next())
    .catch((err) => {
      res.status(503).json({
        success: false,
        message: 'Database unavailable',
        error: err?.message,
      });
    });
});

//parser
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use('/api', routes);

//Testing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to the LeafLink',
  });
});

// global error handler
app.use(globalErrorHandler);

//handle not found
app.use(notFound);

export default app;
