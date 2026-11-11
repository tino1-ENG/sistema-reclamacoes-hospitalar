import mongoose, { Schema, Document } from 'mongoose';

export interface IProcessAttachment extends Document {
  processId: mongoose.Types.ObjectId;
  uploaderId?: mongoose.Types.ObjectId;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  filePath: string;
  fileUrl: string;
  createdAt: Date;
}

const ProcessAttachmentSchema = new Schema<IProcessAttachment>(
  {
    processId: { type: Schema.Types.ObjectId, ref: 'Process', required: true, index: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: 'User' },
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    filePath: { type: String, required: true },
    fileUrl: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ProcessAttachment = mongoose.model<IProcessAttachment>('ProcessAttachment', ProcessAttachmentSchema);
