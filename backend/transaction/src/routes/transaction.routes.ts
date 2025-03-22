import express from 'express';
import { transfer, topUp, purchase, refund } from '../controllers/transaction.controller';

const router = express.Router();

router.post('/transaction/transfer', transfer);
router.post('/transaction/topup', topUp);
router.post('/transaction/purchase', purchase);
router.post('/transaction/refund', refund);

export default router;