import { Request, Response } from 'express';
import Transaction, { ITransaction } from '../models/transaction.model';
import { ICustomer } from '../../../libraries/shared-types/src';
import mongoose from 'mongoose';
import axios from 'axios';
import { getCustomerByGsm, updateCustomerBalance } from '../utils/transaction.utils';

const CUSTOMER_SERVICE_URL = 'http://localhost:8081';



export const transfer = async (req: Request, res: Response) => {
    const { from, to, amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const [sender, receiver] = await Promise.all([
            getCustomerByGsm(from),
            getCustomerByGsm(to)
        ]);

        if (!sender || !receiver) {
            throw new Error('Sender or receiver not found');
        };

        if (sender.balance < amount) {
            throw new Error('Insufficient balance');
        };
    
        if (sender.gsmNumber === receiver.gsmNumber) {
            throw new Error('Cannot transfer to yourself');
        };

        const newBalance = sender.balance - amount;

        await Promise.all([
            updateCustomerBalance(sender.gsmNumber, newBalance),
            updateCustomerBalance(receiver.gsmNumber, receiver.balance + amount),
            Transaction.create([{
                sender: sender.gsmNumber,
                receiver: receiver.gsmNumber,
                amount,
                type: 'transfer'
            }], { session }),
            session.commitTransaction()
        ]);

        session.endSession();

        res.status(200).json({ message: 'Transfer sucessfull', balance: newBalance });
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

        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        };
    
        const customer: ICustomer = await getCustomerByGsm(gsmNumber);

        if (!customer) {
            throw new Error('customer not found');
        };

        const newBalance = customer.balance + amount;
       
        await Promise.all([
            updateCustomerBalance(customer.gsmNumber, newBalance),
            Transaction.create([{
                receiver: customer.gsmNumber,
                amount,
                type: 'top-up'
            }], { session }),
            session.commitTransaction()
        ]);

        session.endSession();

        res.status(200).json({ message: 'Top-up sucessfull', balance: newBalance });
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
        const customer: ICustomer = await getCustomerByGsm(gsmNumber);

        if (!customer) {
            throw new Error('customer not found');
        };

        const newBalance = customer.balance - amount;

        await Promise.all([
            updateCustomerBalance(customer.gsmNumber, newBalance),
            Transaction.create([{
                receiver: customer.gsmNumber,
                amount,
                type: 'purchase'
            }], { session }),
            session.commitTransaction()
        ]);

        session.endSession();

        res.status(200).json({ message: 'Purchase sucessfull', balance: newBalance });
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

        const customer: ICustomer = await getCustomerByGsm(gsmNumber);

        if (!customer) {
            throw new Error('Customer not found');
        };

        const newBalance = customer.balance + amount;

        await Promise.all([
            updateCustomerBalance(customer.gsmNumber, newBalance),
            Transaction.create([{
                receiver: customer.gsmNumber,
                amount,
                type: 'refund',
                relatedTransaction: lastPurchase._id
            }], { session }),
            session.commitTransaction()
        ]);
        session.endSession();

        res.status(200).json({ message: 'Refund successful', balance: newBalance });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}