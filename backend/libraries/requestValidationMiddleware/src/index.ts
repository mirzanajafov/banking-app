import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../../shared-types';

const schemas = {
    customerCreate: Joi.object({
        name: Joi.string().required(),
        surname: Joi.string().required(),
        birthDate: Joi.date().required(),
        gsmNumber: Joi.string().required(),
        balance: Joi.number().positive()
    }),
    customerUpdateBalance: Joi.object({
        gsmNumber: Joi.string().required(),
        balance: Joi.number().positive().required()
    }),
    customerGetByGsmNumber: Joi.object({
        gsmNumber: Joi.string().required()
    }),
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
        const { error } = schemas[operationType].validate({...req.body, ...req.params, ...req.query});
        
        if (error) {
            throw new ValidationError(error.details[0].message, 400);
        }
        
        next();
    };
};