import { Request, Response } from 'express';
import Transaction, { ITransaction } from '../models/transaction.model';
import { ICustomer } from '../../../libraries/shared-types/src';
import mongoose from 'mongoose';
import axios from 'axios';

const CUSTOMER_SERVICE_URL = 'http://localhost:8081';



export const transfer = async (req: Request, res: Response) => {
    const { from, to, amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const senderResp = await axios.get(`${CUSTOMER_SERVICE_URL}/customer/gsm/${from}`);
        const receiverResp = await axios.get(`${CUSTOMER_SERVICE_URL}/customer/gsm/${to}`);
    
        const sender: ICustomer = senderResp.data.customer;
        const receiver: ICustomer = receiverResp.data.customer;

        if (!sender || !receiver) {
            throw new Error('Sender or receiver not found');
        };

        if (sender.balance < amount) {
            throw new Error('Insufficient balance');
        };
    
        if (sender.gsmNumber === receiver.gsmNumber) {
            throw new Error('Cannot transfer to yourself');
        };
      
        const senderBalance = sender.balance - amount;
        const receiverBalance = receiver.balance + amount;

        await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${sender.gsmNumber}/balance`, { balance: senderBalance });
        await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${receiver.gsmNumber}/balance`, { balance: receiverBalance });

        await Transaction.create([{ sender: sender.gsmNumber, receiver: receiver.gsmNumber, amount, type: 'transfer' }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Transfer sucessfull' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

export const topUp = async (req: Request, res: Response) => {
    const { gsmNumber, amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const customerResp = await axios.get(`${CUSTOMER_SERVICE_URL}/customer/gsm/${gsmNumber}`);
    
        const customer: ICustomer = customerResp.data.customer;

        if (!customer) {
            throw new Error('customer not found');
        };

        const customerBalance = customer.balance + amount;//check - amount

        await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${customer.gsmNumber}/balance`, { balance: customerBalance });

        await Transaction.create([{ receiver: customer.gsmNumber, amount, type: 'top-up' }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Top-up sucessfull' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}

export const purchase = async (req: Request, res: Response) => {
    const { gsmNumber, amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const customerResp = await axios.get(`${CUSTOMER_SERVICE_URL}/customer/gsm/${gsmNumber}`);
    
        const customer: ICustomer = customerResp.data.customer;

        if (!customer) {
            throw new Error('customer not found');
        };

        const customerBalance = customer.balance - amount;

        await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${customer.gsmNumber}/balance`, { balance: customerBalance });

        await Transaction.create([{ receiver: customer.gsmNumber, amount, type: 'purchase' }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Purchase sucessfull' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}

export const refund = async (req: Request, res: Response) => {
    const { gsmNumber, amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const lastPurchase = await Transaction.findOne({ receiver: gsmNumber, type: 'purchase' }).sort({ createdAt: -1 });

        if (!lastPurchase) {
            throw new Error('No purchase found');
        };

        if (lastPurchase.amount < amount) {
            throw new Error('Refund amount cannot be greater than purchase amount');
        }

        const customerResp = await axios.get(`${CUSTOMER_SERVICE_URL}/customer/gsm/${gsmNumber}`);
        const customer: ICustomer = customerResp.data.customer;

        if (!customer) {
            throw new Error('Customer not found');
        };

        const customerBalance = customer.balance + amount;
        await axios.patch(`${CUSTOMER_SERVICE_URL}/customer/${customer.gsmNumber}/balance`, 
            { balance: customerBalance }
        );

        await Transaction.create([{
            receiver: customer.gsmNumber,
            amount,
            type: 'refund',
            relatedTransaction: lastPurchase._id
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Refund successful' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}