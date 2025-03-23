import { NextFunction, Request, Response } from 'express';
import Customer, { ICustomer } from '../models/customer.model';
import { 
    CustomerNotFoundError, 
    InvalidCustomerDataError, 
    DuplicateGsmError
} from '../../../libraries/shared-types/src';


export const createCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, surname, birthDate, gsmNumber, balance } = req.body;

        if (!name || !surname || !birthDate || !gsmNumber) {
            throw new Error('Missing required fields');
        };

        const existingCustomer: ICustomer | null = await Customer.findOne({ gsmNumber });
        if (existingCustomer) {
            throw new DuplicateGsmError(gsmNumber);
        }

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

// export const getCustomers = async (req: Request, res: Response) => {
//     try {
//         const customers: ICustomer[] = await Customer.find();

//         res.status(200).json({ customers });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const customer: ICustomer | null = await Customer.findById(id);

//         if (!customer) {
//             throw new CusstomerNotFoundError(id);
//         };

//         res.status(200).json({ customer });
//     } catch (error) {
//         next(error);
//     }
// };

export const updateCustomerBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { balance } = req.body;
        const { gsmNumber } = req.params;
        const customer: ICustomer = await Customer.findOneAndUpdate({ gsmNumber }, { balance
        }, { new: true });
    
        if (!customer) {
            throw new CustomerNotFoundError(gsmNumber);
        }

        res.json({ customer, message: 'balance updated successfully' });
    } catch (error) {
        next(error);
        
    } 
};

// export const customerLogin = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { gsmNumber } = req.body;
//         const customer: ICustomer | null = await Customer.findOne({ gsmNumber });

//         if (!customer) {
//             throw new CusstomerNotFoundError(gsmNumber);
//         };

//         res.status(200).json({ customer });
//     } catch (error) {
//         next(error);
//     }
// }

export const getCustomerByGsmNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gsmNumber } = req.params;
        const customer: ICustomer | null = await Customer.findOne({ gsmNumber });
        if (!customer) {
            throw new CustomerNotFoundError(gsmNumber);
        };
        res.status(200).json({ customer });
    } catch (error) {
        next(error);
    }
};