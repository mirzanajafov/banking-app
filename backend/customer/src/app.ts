import express from 'express';
import connectDB from './config/db';
import customerRoutes from './routes/customer.routes';

connectDB();
const app = express();

app.use(express.json());

app.use('/customers', customerRoutes);

export default app;