import { Types } from 'mongoose';

export type TNotificationType =
  | 'follow'
  | 'comment'
  | 'reply'
  | 'upvote'
  | 'mention'
  | 'premium';

export type TNotification = {
  recipient: Types.ObjectId;
  actor?: Types.ObjectId;
  type: TNotificationType;
  post?: Types.ObjectId;
  comment?: Types.ObjectId;
  message?: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
