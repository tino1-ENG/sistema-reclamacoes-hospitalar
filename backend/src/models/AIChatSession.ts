import mongoose, { Schema, Document } from 'mongoose';

export interface IAIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface IAIChatSession extends Document {
  sessionId: string;
  userId?: mongoose.Types.ObjectId;
  ipAddress?: string;
  messages: IAIChatMessage[];
  context?: {
    intent?: string;
    extractedType?: string;
    extractedDepartment?: string;
    suggestedProcess?: {
      title?: string;
      description?: string;
      type?: string;
      departmentId?: string;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AIChatMessageSchema = new Schema<IAIChatMessage>(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed }
  },
  { _id: false }
);

const AIChatSessionSchema = new Schema<IAIChatSession>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    ipAddress: { type: String },
    messages: [AIChatMessageSchema],
    context: {
      intent: { type: String },
      extractedType: { type: String },
      extractedDepartment: { type: String },
      suggestedProcess: { type: Schema.Types.Mixed }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const AIChatSession = mongoose.model<IAIChatSession>('AIChatSession', AIChatSessionSchema);
