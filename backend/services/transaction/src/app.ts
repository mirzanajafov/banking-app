import express from 'express';
import connectDB from './config/db';
import transactionRoutes from './routes/transaction.routes';
import { errorHandler } from '../../../libraries/errorMiddleware';
import { rateLimiter } from '../../../libraries/rateLimitMiddleware';

connectDB();

const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use('/transaction', transactionRoutes);

app.use(errorHandler);

export default app;