import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`API gateway running on port ${PORT}`);
    console.log(`Customer Service URL: ${process.env.CUSTOMER_SERVICE_URL || 'http://localhost:8081'}`);
    console.log(`Transaction Service URL: ${process.env.TRANSACTION_SERVICE_URL || 'http://localhost:8082'}`);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});