import express from 'express';
import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimiter } from '../../../libraries/rateLimitMiddleware';
import { errorHandler } from '../../../libraries/errorMiddleware';
import {  NextFunction, Request, Response } from 'express';

const app = express();

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimiter);

const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:8081';
const TRANSACTION_SERVICE_URL = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:8082';

app.use('/customer', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${CUSTOMER_SERVICE_URL}${req.originalUrl}`,
            data: req.body
        }); 
        res.status(response.status).json(response.data);
    }catch (error) {
        if(error.response){
             res.status(error.response.status).json(error.response.data);
             return;
        }
        next(error);
    }
});
app.use('/transaction', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${TRANSACTION_SERVICE_URL}${req.originalUrl}`,
            data: req.body
        }); 
        res.status(response.status).json(response.data);
    }catch (error) {
        if(error.response){
            res.status(error.response.status).json(error.response.data);
            return;
        }
        next(error);
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use(errorHandler);

export default app;