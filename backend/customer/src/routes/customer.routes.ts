import express from 'express';
import { createCustomer, customerLogin, getCustomerById, getCustomers, updateCustomerBalance } from '../controllers/customer.controller';

const router = express.Router();

router.post('/customer', createCustomer);
router.get('/customer/:id', getCustomerById);
router.get('/customer/:id/balance', updateCustomerBalance);
router.get('/customers', getCustomers);
router.post('/customer/login', customerLogin);

export default router;