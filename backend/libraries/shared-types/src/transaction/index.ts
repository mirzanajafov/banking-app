export interface ITransaction extends Document {
  sender: string;
  receiver: string;
  amount: number;
  type: "top-up" | "transfer" | "refund" | "purchase";
  relatedTransaction?: string;
};

//errror types

export class TransactionError extends Error {
    constructor(message: string, public statusCode: number = 500) {
      super(message);
      this.name = 'TransactionError';
    }
  }
  
  export class InsufficientBalanceError extends TransactionError {
    constructor() {
      super('Insufficient balance', 400);
      this.name = 'InsufficientBalanceError';
    }
  }
  
  export class CustomerNotFoundError extends TransactionError {
    constructor() {
      super('Customer not found', 404);
      this.name = 'CustomerNotFoundError';
    }
  }
  
  export class InvalidTransferError extends TransactionError {
    constructor(message: string) {
      super(message, 400);
      this.name = 'InvalidTransferError';
    }
  }
  
  export class InvalidAmountError extends TransactionError {
    constructor() {
      super('Amount must be greater than 0', 400);
      this.name = 'InvalidAmountError';
    }
  }
  
  export class NoPurchaseFoundError extends TransactionError {
    constructor() {
      super('No purchase found', 404);
      this.name = 'NoPurchaseFoundError';
    }
  }
