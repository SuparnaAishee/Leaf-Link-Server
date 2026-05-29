import { Schema, model } from 'mongoose';
import { TNotification } from './notification.interface';

const notificationSchema = new Schema<TNotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['follow', 'comment', 'reply', 'upvote', 'mention', 'premium'],
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    message: { type: String },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Notification = model<TNotification>(
  'Notification',
  notificationSchema
);
