// import { Comment } from './comment.model';

// // Create a comment
// export const createComment = async (
//   postId: string,
//   userId: string,
//   commentText: string
// ) => {
//   try {
//     const newComment = await Comment.create({
//       comment: commentText,
//       post: postId,
//       user: userId,
//     });

//     return newComment;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error:any) {
//     throw new Error(`Error creating comment: ${error.message}`);
//   }
// };

// // Get all comments by post
// export const getCommentsByPost = async (postId: string) => {
//   try {
//     const comments = await Comment.find({ post: postId }).populate(
//       'user',
//       'name'
//     ); // Assuming the User model has a 'name' field
//     return comments;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error:any) {
//     throw new Error(`Error fetching comments for post: ${error.message}`);
//   }
// };

// // Delete a comment by comment ID
// export const deleteComment = async (commentId: string, userId: string) => {
//   try {
//     const comment = await Comment.findById(commentId);

//     if (!comment) {
//       throw new Error('Comment not found');
//     }

//     // Ensure that only the user who created the comment can delete it
//     if (comment.user.toString() !== userId) {
//       throw new Error('Unauthorized: Cannot delete this comment');
//     }

//     await Comment.findByIdAndDelete(commentId);
//     return { message: 'Comment deleted successfully' };
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error:any) {
//     throw new Error(`Error deleting comment: ${error.message}`);
//   }
// };

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { IComment } from './comment.interface';
import { Comment } from './comment.model';
import { Post } from '../Post/post.model';

const createCommentInToDB = async (payload: IComment) => {
  const isUserExist = await User.findById(payload.user);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exist');
  }

  const isPostExist = await Post.findById(payload.post);
  if (!isPostExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This post  is not exist');
  }
  payload.postUser = isPostExist.user;
  const result = await Comment.create(payload);
  return result;
};

const getAllCommentFromDB = async () => {
  const result = await Comment.find()
    .populate('user')
    .populate('postUser')
    .populate('post');
  return result;
};

const getSingleCommentFromDB = async (id: string) => {
  const result = await Comment.findById(id)
    .populate('user')
    .populate('postUser')
    .populate('post');
  return result;
};

const editCommentInToDB = async (id: string, payload: Partial<IComment>) => {
  const isUserExist = await User.findById(payload.user);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not exist');
  }

  const isPostExist = await Post.findById(payload.post);
  if (!isPostExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This post  is not exist');
  }
  const result = await Comment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('user')
    .populate('postUser')
    .populate('post');
  return result;
};

const deleteCommentFromDB = async (id: string) => {
  const isCommentExist = await Comment.findById(id);
  if (!isCommentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This comment is not exist');
  }

  return await Comment.findByIdAndDelete(id, {
    new: true,
    runValidators: true,
  });
};

export const commentService = {
  createCommentInToDB,
  getAllCommentFromDB,
  editCommentInToDB,
  getSingleCommentFromDB,
  deleteCommentFromDB,
};
