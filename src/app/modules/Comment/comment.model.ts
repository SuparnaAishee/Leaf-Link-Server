// import { Schema, model } from 'mongoose';

// export interface IComment {
//   comment: string;
//   post: Schema.Types.ObjectId;
//   user: Schema.Types.ObjectId;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const commentSchema = new Schema<IComment>(
//   {
//     comment: {
//       type: String,
//       required: true,
//     },
//     post: {
//       type: Schema.Types.ObjectId,
//       ref: 'Post',
//       required: true,
//     },
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   },
//   {
//     timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
//   }
// );

// export const Comment = model<IComment>('Comment', commentSchema);

import { Schema, model } from 'mongoose';
import { IComment } from './comment.interface';

const commentSchema = new Schema<IComment>(
  {
    comment: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    postUser: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

export const Comment = model<IComment>('Comment', commentSchema);
