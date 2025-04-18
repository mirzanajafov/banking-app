import { NextFunction, Request, Response } from 'express';
import Transaction, { ITransaction } from '../models/transaction.model';
import { 
    ICustomer, 
    InsufficientBalanceError, 
    InvalidCustomer,
    InvalidAmountError,
    InvalidTransferError,
    NoPurchaseFoundError,
    TransactionError
} from '../../../../libraries/shared-types';
import mongoose from 'mongoose';
import { getCustomerByGsm, updateCustomerBalance } from '../utils/transaction.utils';


export const transfer = async (req: Request, res: Response, next: NextFunction) => {
    const { from, to, amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const [sender, receiver] = await Promise.all([
            getCustomerByGsm(from),
            getCustomerByGsm(to)
        ]);

        if (!sender || !receiver) {
            throw new InvalidCustomer();
        };

        if (sender.balance < amount) {
            throw new InsufficientBalanceError();
        };
    
        if (sender.gsmNumber === receiver.gsmNumber) {
            throw new InvalidTransferError('Cannot transfer to same account');
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

        res.status(200).json({ message: 'Transfer sucessfull', balance: newBalance });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally{
        session.endSession();
    }
};

export const topUp = async (req: Request, res: Response, next: NextFunction) => {
    const { gsmNumber, amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        if (amount <= 0) {
            throw new InvalidAmountError();
        };
    
        const customer: ICustomer = await getCustomerByGsm(gsmNumber);

        if (!customer) {
            throw new InvalidCustomer();
        };

        const newBalance = customer.balance + amount;
       
        await Promise.all([
            updateCustomerBalance(customer.gsmNumber, newBalance),
            Transaction.create([{
                receiver: customer.gsmNumber,
                amount,
                type: 'top-up'
            }], { session })
        ]);

        await session.commitTransaction();

        res.status(200).json({ message: 'Top-up sucessfull', balance: newBalance });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
}

export const purchase = async (req: Request, res: Response, next: NextFunction) => {
    const { gsmNumber, amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const customer: ICustomer = await getCustomerByGsm(gsmNumber);

        if (!customer) {
            throw new InvalidCustomer();
        };

        const newBalance = customer.balance - amount;

        await Promise.all([
            updateCustomerBalance(customer.gsmNumber, newBalance),
            Transaction.create([{
                sender: customer.gsmNumber,
                amount,
                type: 'purchase'
            }], { session }),
        ]);

        await session.commitTransaction()

        res.status(200).json({ message: 'Purchase sucessfull', balance: newBalance });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
}

export const refund = async (req: Request, res: Response, next: NextFunction) => {
    const { gsmNumber, amount } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const lastPurchase = await Transaction.findOne({ sender: gsmNumber, type: 'purchase' }).sort({ createdAt: -1 });
        if (!lastPurchase) {
            throw new NoPurchaseFoundError();
        };

        if (lastPurchase.refunded) {
            throw new TransactionError('Purchase already refunded');
        }

        if (lastPurchase.amount < amount) {
            throw new TransactionError('Refund amount cannot be greater than purchase amount');
        }

        const customer: ICustomer = await getCustomerByGsm(gsmNumber);

        if (!customer) {
            throw new InvalidCustomer();
        };

        const newBalance = customer.balance + amount;

        await Promise.all([
            Transaction.findByIdAndUpdate(lastPurchase._id, { $set: { refunded: true } }, { session }),    
            updateCustomerBalance(customer.gsmNumber, newBalance),
            Transaction.create([{
                receiver: customer.gsmNumber,
                amount,
                type: 'refund',
                relatedTransaction: lastPurchase._id
            }], { session }),
        ]);

        await session.commitTransaction()

        res.status(200).json({ message: 'Refund successful', balance: newBalance });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        if (session) {
            session.endSession();
        }
    }
}