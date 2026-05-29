import { Types } from 'mongoose';

export type TEvent = {
  host: Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  location?: string;
  image?: string;
  attendees: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
};
