import express from 'express';
import { createCustomer, updateCustomerBalance, getCustomerByGsmNumber } from '../controllers/customer.controller';
import { validateRequest } from '../../../../libraries/requestValidationMiddleware';

const router = express.Router();

router.post('/', validateRequest("customerCreate"), createCustomer);
router.get('/:gsmNumber', validateRequest("customerGetByGsmNumber"), getCustomerByGsmNumber);
router.patch('/:gsmNumber/balance', validateRequest("customerUpdateBalance"), updateCustomerBalance);

export default router;