import express from 'express';
import { createCustomer, updateCustomerBalance, getCustomerByGsmNumber } from '../controllers/customer.controller';

const router = express.Router();

router.post('/customer', createCustomer);
// router.get('/customer/:id', getCustomerById);
router.patch('/customer/:gsmNumber/balance', updateCustomerBalance);
// router.get('/customers', getCustomers);
// router.post('/customer/login', customerLogin);
router.get('/customer/:gsmNumber', getCustomerByGsmNumber);

export default router;