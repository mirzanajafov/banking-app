import { StatusCodes } from 'http-status-codes';

export class BaseError extends Error {
    constructor(message: string, public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
      super(message);
      this.name = this.constructor.name;
    }
  }

export class TransactionError extends BaseError {
    constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
      super(message, statusCode);
      this.name = 'TransactionError';
    }
  }
  
  export class InsufficientBalanceError extends TransactionError {
    constructor() {
      super('Insufficient balance', StatusCodes.BAD_REQUEST);
      this.name = 'InsufficientBalanceError';
    }
  }
  
  export class InvalidCustomer extends TransactionError {
    constructor() {
      super('Customer not found', StatusCodes.NOT_FOUND);
      this.name = 'InvalidCustomer';
    }
  }
  
  export class InvalidTransferError extends TransactionError {
    constructor(message: string) {
      super(message, StatusCodes.BAD_REQUEST);
      this.name = 'InvalidTransferError';
    }
  }
  
  export class InvalidAmountError extends TransactionError {
    constructor() {
      super('Amount must be greater than 0', StatusCodes.BAD_REQUEST);
      this.name = 'InvalidAmountError';
    }
  }
  
  export class NoPurchaseFoundError extends TransactionError {
    constructor() {
      super('No purchase found', StatusCodes.NOT_FOUND);
      this.name = 'NoPurchaseFoundError';
    }
  }


  export class CustomerError extends BaseError {
    constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, statusCode);
        this.name = 'CustomerError';
    }
}

export class CustomerNotFoundError extends CustomerError {
    constructor(gsmNumber: string) {
        super(`Customer not found with GSM number: ${gsmNumber}`, StatusCodes.NOT_FOUND);
        this.name = 'CustomerNotFoundError';
    }
}

export class InvalidCustomerDataError extends CustomerError {
    constructor(message: string) {
        super(message, StatusCodes.BAD_REQUEST);
        this.name = 'InvalidCustomerDataError';
    }
}

export class DuplicateGsmError extends CustomerError {
    constructor(gsmNumber: string) {
        super(`Customer already exists with GSM number: ${gsmNumber}`, StatusCodes.CONFLICT);
        this.name = 'DuplicateGsmError';
    }
}

export class ValidationError extends BaseError {
    constructor(message: string, statusCode: number = StatusCodes.BAD_REQUEST) {
        super(message, statusCode);
        this.name = 'ValidationError';
    }
}