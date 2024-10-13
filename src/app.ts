/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import routes from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';


const app: Application = express();
app.use(
  cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true, // Allow cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
  })
);
//parser
app.use(express.json());

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
