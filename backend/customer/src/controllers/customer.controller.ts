import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/customer.model';

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, surname, birthDate, gsmNumber, balance } = req.body;
        console.log(req.body);

        if (!name || !surname || !birthDate || !gsmNumber) {
            throw new Error('Missing required fields');
        };

        const customer: ICustomer = new Customer({
        name,
        surname,
        birthDate,
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
};

export const getCustomerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const customer: ICustomer | null = await Customer.findById(id);

        if (!customer) {
            throw new Error('Customer not found');
        };

        res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCustomerBalance = async (req: Request, res: Response) => {
    try {
        const { balance } = req.body;
        const { id } = req.params;
        const customer: ICustomer = await Customer.findByIdAndUpdate(id, { balance
        }, { new: true });
    
        if (!customer) {
            throw new Error('Customer not found',);
        }

        res.json({ customer, message: 'balance updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    } 
};

export const customerLogin = async (req: Request, res: Response) => {
    try {
        const { gsmNumber } = req.body;
        const customer: ICustomer | null = await Customer.findOne({ gsmNumber });

        if (!customer) {
            throw new Error('Customer not found');
        };

        res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCustomerByGsmNumber = async (req: Request, res: Response) => {
    try {
        const { gsmNumber } = req.params;
        const customer: ICustomer | null = await Customer.findOne({ gsmNumber });
        if (!customer) {
            throw new Error('Customer not found');
        };
        res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};