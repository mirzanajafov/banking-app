import express from 'express';
import { createCustomer, updateCustomerBalance, getCustomerByGsmNumber } from '../controllers/customer.controller';
import { validateRequest } from '../../../../libraries/requestValidationMiddleware';

const router = express.Router();

router.post('/customer', validateRequest("customerCreate"), createCustomer);
router.get('/customer/:gsmNumber', validateRequest("customerGetByGsmNumber"), getCustomerByGsmNumber);
router.patch('/customer/:gsmNumber/balance', validateRequest("customerUpdateBalance"), updateCustomerBalance);

export default router;