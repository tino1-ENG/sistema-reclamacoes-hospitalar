import mongoose, { Schema, Document } from 'mongoose';

export interface IFaq extends Document {
  hospitalId: mongoose.Types.ObjectId;
  category: string;
  question: string;
  answer: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    category: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Faq = mongoose.model<IFaq>('Faq', FaqSchema);
