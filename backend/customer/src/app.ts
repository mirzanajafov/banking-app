import express from 'express';
import connectDB from './config/db';
import customerRoutes from './routes/customer.routes';
import { errorHandler } from './middleware/error.middleware';
import { rateLimiter } from './middleware/rateLimit.middleware';

connectDB();

const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use('/', customerRoutes);
app.use(errorHandler);

export default app;