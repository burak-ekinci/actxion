import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  address: string;
  email: string;
  password: string;
  nonce: string;
  signature: string;
}
const User = new Schema<IUser>(
  {
    address: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    nonce: { type: String },
    signature: { type: String },
  },
  { timestamps: true }
);

export default model<IUser>("User", User);
