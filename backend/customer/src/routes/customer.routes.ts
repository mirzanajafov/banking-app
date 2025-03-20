import express from 'express';
import { createCustomer, getCustomers } from '../controllers/customer.controller';

const router = express.Router();

router.post('/customer', createCustomer);
router.get('/customers', getCustomers);

export default router;