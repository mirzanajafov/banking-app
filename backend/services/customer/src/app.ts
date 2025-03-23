import express from 'express';
import connectDB from './config/db';
import customerRoutes from './routes/customer.routes';
import { errorHandler } from '../../../libraries/errorMiddleware';
import { rateLimiter } from '../../../libraries/rateLimitMiddleware';

connectDB();

const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use('/', customerRoutes);
app.use(errorHandler);

export default app;