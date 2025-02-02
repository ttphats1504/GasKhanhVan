import mongoose, { Document, Schema } from 'mongoose';

export interface ICylinder extends Document {
  name: string;
  type: string;
  price: number;
  stock: number;
  image: string;
  description: string; // Rich text description
  createdAt: Date;
}

const cylinderSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true }, // Rich text description
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICylinder>('Cylinder', cylinderSchema);