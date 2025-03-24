import express from 'express';
import { transfer, topUp, purchase, refund } from '../controllers/transaction.controller';
import { validateRequest } from '../../../../libraries/requestValidationMiddleware';

const router = express.Router();

router.post('/transaction/transfer', validateRequest('transfer'), transfer);
router.post('/transaction/topup', validateRequest('topUp'), topUp);
router.post('/transaction/purchase', validateRequest('purchase'), purchase);
router.post('/transaction/refund', validateRequest('refund'), refund);

export default router;