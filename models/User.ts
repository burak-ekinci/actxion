import { Schema, model, Document, models } from "mongoose";

interface IUser extends Document {
  walletAddress?: string;
  email: string;
  password: string;
  nonce?: string;
  signature?: string;
}

const UserSchema = new Schema<IUser>(
  {
    walletAddress: { type: String, unique: true }, // Optional, unique ama null değerlere izin ver
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nonce: { type: String },
    signature: { type: String },
  },
  { timestamps: true }
);

// Model zaten compile edilmişse mevcut olanı kullan, yoksa yeni oluştur
const User = models.User || model<IUser>("User", UserSchema);

export default User;
