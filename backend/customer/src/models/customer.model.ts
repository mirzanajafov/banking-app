import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  surname: string;
  birthdate: Date;
  gsmNumber: string;
  balance: number;
};

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    birthdate: { type: Date, required: true },
    gsmNumber: { type: String, required: true },
    balance: { type: Number, default: 100 },
  },
  { timestamps: true }
);

export default mongoose.model<ICustomer>("Customer", CustomerSchema);
