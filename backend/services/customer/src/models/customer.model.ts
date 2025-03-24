import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  surname: string;
  birthDate: Date;
  gsmNumber: string;
  balance?: number;
};

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gsmNumber: { type: String, required: true },
    balance: { type: Number, default: 100 }
  },
  { timestamps: true }
);

CustomerSchema.set("toJSON", {
  transform: (doc: any, retObject: any) => {
    retObject.birthDate = retObject.birthDate.toISOString().split("T")[0];
  },
});

export default mongoose.model<ICustomer>("Customer", CustomerSchema);
