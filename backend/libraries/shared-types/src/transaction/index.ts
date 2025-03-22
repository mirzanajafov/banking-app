export interface ITransaction extends Document {
    sender: string;
    receiver: string;
    amount: number;
    type: 'top-up' | 'transfer' | 'refund' | 'purchase';
  };