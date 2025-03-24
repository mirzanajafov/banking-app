import mongoose, { Document } from "mongoose";

export interface ITransaction extends Document {
  sender: string;
  receiver: string;
  amount: number;
  type: 'top-up' | 'transfer' | 'refund' | 'purchase';
  relatedTransaction?: string;
  refunded?: boolean;
};

const TransactionSchema = new mongoose.Schema(
  {
    sender: { type: String,  required: false },
    receiver: { type: String, required: false },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['top-up', 'purchase', 'refund', 'transfer'], required: true },
    relatedTransaction: { type: String, required: false },
    refunded: { type: Boolean, required: false,
      default: function(this: ITransaction) {
        return this.type === 'purchase' ? false : undefined;
      }}
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);