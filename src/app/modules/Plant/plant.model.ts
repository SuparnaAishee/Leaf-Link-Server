import { Schema, model } from 'mongoose';
import { TPlant } from './plant.interface';

const plantSchema = new Schema<TPlant>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    species: { type: String, trim: true },
    photo: { type: String },
    plantedAt: { type: Date, default: () => new Date() },
    waterIntervalDays: { type: Number, default: 7, min: 1, max: 90 },
    lastWateredAt: { type: Date, default: () => new Date() },
    fertilizeIntervalDays: { type: Number, default: 30, min: 1, max: 365 },
    lastFertilizedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Plant = model<TPlant>('Plant', plantSchema);
