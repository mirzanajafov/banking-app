import express from 'express';
import connectDB from './config/db';
import transactionRoutes from './routes/transaction.routes';
import { errorHandler } from '../../libraries/errorMiddleware';
import { rateLimiter } from './middleware/rateLimit.middleware';

connectDB();

const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use('/', transactionRoutes);

app.use(errorHandler);

export default app;