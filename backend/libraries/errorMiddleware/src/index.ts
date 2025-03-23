import { Request, Response, NextFunction } from "express";
import winston from "winston";
import { BaseError } from '../../shared-types';

const logger = winston.createLogger({
  level: "error",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log" }),
  ]
});

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message);

  if (error instanceof BaseError) {
     res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      code: error.name
     });
    return;
  }
    res.status(500).json({ 
      status: 'error',
      message: error.message
     });
};