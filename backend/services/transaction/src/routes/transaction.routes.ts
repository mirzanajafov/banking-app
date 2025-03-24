import express from 'express';
import { transfer, topUp, purchase, refund } from '../controllers/transaction.controller';
import { validateRequest } from '../../../../libraries/requestValidationMiddleware';

const router = express.Router();

router.post('/transfer', validateRequest('transfer'), transfer);
router.post('/topup', validateRequest('topUp'), topUp);
router.post('/purchase', validateRequest('purchase'), purchase);
router.post('/refund', validateRequest('refund'), refund);

export default router;