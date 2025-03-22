import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { TransactionError } from '../../../libraries/shared-types/src';

const schemas = {
    transfer: Joi.object({
        from: Joi.string().required(),
        to: Joi.string().required(),
        amount: Joi.number().positive().required()
    }),
    
    topUp: Joi.object({
        gsmNumber: Joi.string().required(),
        amount: Joi.number().positive().required()
    }),
    
    purchase: Joi.object({
        gsmNumber: Joi.string().required(),
        amount: Joi.number().positive().required()
    }),
    
    refund: Joi.object({
        gsmNumber: Joi.string().required(),
        amount: Joi.number().positive().required()
    })
};

export const validateRequest = (operationType: keyof typeof schemas) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const { error } = schemas[operationType].validate(req.body);
        
        if (error) {
            throw new TransactionError(error.details[0].message, 400);
        }
        
        next();
    };
};