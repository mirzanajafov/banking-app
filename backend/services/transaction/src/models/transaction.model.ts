import mongoose, { Document } from "mongoose";

export interface ITransaction extends Document {
  sender: string;
  receiver: string;
  amount: number;
  type: 'top-up' | 'transfer' | 'refund' | 'purchase';
  relatedTransaction?: string;
};

const TransactionSchema = new mongoose.Schema(
  {
    sender: { type: String,  required: false },
    receiver: { type: String, required: false },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['top-up', 'purchase', 'refund', 'transfer'], required: true },
    relatedTransaction: { type: String, required: false }
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);