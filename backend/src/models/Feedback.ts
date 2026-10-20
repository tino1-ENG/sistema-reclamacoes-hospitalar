import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  processId: mongoose.Types.ObjectId;
  patientId?: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  isPublic: boolean;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    processId: { type: Schema.Types.ObjectId, ref: 'Process', required: true, unique: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    isPublic: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
