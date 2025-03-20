import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/customer.model';

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { name, surname, birthdate, gsmNumber, balance } = req.body;

        if (!name || !surname || !birthdate || !gsmNumber) {
            throw new Error('Missing required fields');
        };

        const customer: ICustomer = new Customer({
        name,
        surname,
        birthdate,
        gsmNumber,
        balance
        });
    
        await customer.save();
        res.status(201).json({ customer, message: 'Customer created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers: ICustomer[] = await Customer.find();
        res.status(200).json({ customers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}