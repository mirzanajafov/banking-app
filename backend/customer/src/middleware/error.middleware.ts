import { Request, Response, NextFunction } from "express";
import winston from "winston";

const logger = winston.createLogger({
  level: "error",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log" }),
  ]
});

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message);
  res.status(500).json({ message: error.message });
};