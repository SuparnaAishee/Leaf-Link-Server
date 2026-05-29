import { Schema, model } from 'mongoose';
import { TAiScan } from './aiScan.interface';

const aiScanSchema = new Schema<TAiScan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    kind: { type: String, enum: ['identify', 'diagnose'], required: true },
    imageUrl: { type: String },
    hint: { type: String },
    result: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const AiScan = model<TAiScan>('AiScan', aiScanSchema);
