import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  processId?: mongoose.Types.ObjectId;
  title: string;
  body: string;
  channel: 'IN_APP' | 'SMS' | 'EMAIL';
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    processId: { type: Schema.Types.ObjectId, ref: 'Process' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    channel: { type: String, enum: ['IN_APP', 'SMS', 'EMAIL'], default: 'IN_APP' },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
