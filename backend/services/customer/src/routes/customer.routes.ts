import express from 'express';
import { createCustomer, updateCustomerBalance, getCustomerByGsmNumber } from '../controllers/customer.controller';

const router = express.Router();

router.post('/customer', createCustomer);
router.get('/customer/:gsmNumber', getCustomerByGsmNumber);
router.patch('/customer/:gsmNumber/balance', updateCustomerBalance);

export default router;