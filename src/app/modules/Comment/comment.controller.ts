// import { Request, Response } from 'express';
// import {
//   createComment,
//   getCommentsByPost,
//   deleteComment,
// } from './comment.service';

// // Create a new comment
// export const createCommentController = async (req: Request, res: Response) => {
//   const { postId, comment } = req.body;
//   const userId = req.user._id; // Assuming `req.user` contains the logged-in user's details

//   try {
//     const newComment = await createComment(postId, userId, comment);
//     res.status(201).json({ success: true, data: newComment });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error:any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get all comments for a specific post
// export const getCommentsByPostController = async (
//   req: Request,
//   res: Response
// ) => {
//   const { postId } = req.params;

//   try {
//     const comments = await getCommentsByPost(postId);
//     res.status(200).json({ success: true, data: comments });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error:any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Delete a comment
// export const deleteCommentController = async (req: Request, res: Response) => {
//   const { commentId } = req.params;
//   const userId = req.user._id; // Assuming `req.user` contains the logged-in user's details

//   try {
//     await deleteComment(commentId, userId);
//     res
//       .status(200)
//       .json({ success: true, message: 'Comment deleted successfully' });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error:any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { commentService } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const comment = await commentService.createCommentInToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully commented in this post',
    data: comment,
  });
});

const getAllComment = catchAsync(async (req, res) => {
  const comment = await commentService.getAllCommentFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comments are retrieved successfully!',
    data: comment,
  });
});

const getSingleComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await commentService.getSingleCommentFromDB(commentId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comments is retrieved successfully!',
    data: comment,
  });
});

const editComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await commentService.editCommentInToDB(commentId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment is  updated successfully!',
    data: comment,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await commentService.deleteCommentFromDB(commentId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment is  deleted successfully!',
    data: comment,
  });
});

const getCommentsByPost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const comments = await commentService.getCommentsByPostFromDB(postId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comments for the post retrieved successfully!',
    data: comments,
  });
});

export const commentController = {
  createComment,
  getAllComment,
  editComment,
  getSingleComment,
  deleteComment,
  getCommentsByPost,
};
