import mongoose, { Document } from "mongoose";

export interface ITransaction extends Document {
  sender: string;
  receiver: string;
  amount: number;
  type: 'top-up' | 'transfer' | 'refund' | 'purchase';
};

const TransactionSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['top-up', 'purchase', 'refund', 'transfer'], required: true },
    receiver: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);