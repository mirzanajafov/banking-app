import { Request, Response, NextFunction } from "express";
import winston from "winston";
import { TransactionError } from '../../../libraries/shared-types/src';

const logger = winston.createLogger({
  level: "error",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log" }),
  ]
});

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message);

  if (error instanceof TransactionError) {
     res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      code: error.name
     });
    return;
  }
    res.status(500).json({ message: error.message });
};