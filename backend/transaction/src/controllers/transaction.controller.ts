import { Request, Response } from 'express';
import Transaction, { ITransaction } from '../models/transaction.model';
import mongoose from 'mongoose';
import axios from 'axios';

const CUSTOMER_SERVICE_URL = 'http://localhost:8081';

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
    const { from, to, amount, type } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    


    try {
        const senderResp = await axios.get(`${CUSTOMER_SERVICE_URL}/customer/gsm/${from}`);
        const receiverResp = await axios.get(`${CUSTOMER_SERVICE_URL}/customer/gsm/${to}`);
    
        const sender = senderResp.data.customer;
        const receiver = receiverResp.data.customer;
    
    
        if (!sender || !receiver) {
            throw new Error('Sender or receiver not found');
        };
    
        if (sender.balance < amount) {
            throw new Error('Insufficient balance');
        };
    
        if (sender.gsmNumber === receiver.gsmNumber) {
            throw new Error('Cannot transfer to yourself');
        };

        if (type === 'transfer') {
            const senderBalance = sender.balance - amount;
            const receiverBalance = receiver.balance + amount;
    
            await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${sender._id}/balance`, { balance: senderBalance });
            await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${receiver._id}/balance`, { balance: receiverBalance });
        }else if (type === 'top-up') {
            const receiverBalance = receiver.balance + amount;
            await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${receiver._id}/balance`, { balance: receiverBalance });
        }else if (type === 'purchase') {
            const senderBalance = sender.balance - amount;
            await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${sender._id}/balance`, { balance: senderBalance });
        }else if (type === 'refund') {
            const receiverBalance = receiver.balance + amount;
            await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${receiver._id}/balance`, { balance: receiverBalance });
        }else {
            throw new Error('Invalid transaction type');
        }

        await Transaction.create([{ sender: sender.gsmNumber, receiver: receiver.gsmNumber, amount, type }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Transfer sucessfull' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
};