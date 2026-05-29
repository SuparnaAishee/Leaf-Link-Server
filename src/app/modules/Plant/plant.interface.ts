import { Types } from 'mongoose';

export type TPlant = {
  user: Types.ObjectId;
  name: string;
  species?: string;
  photo?: string;
  plantedAt?: Date;
  waterIntervalDays?: number;
  lastWateredAt?: Date;
  fertilizeIntervalDays?: number;
  lastFertilizedAt?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
