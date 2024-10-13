// import { Router } from 'express';
// import {
//   createCommentController,
//   getCommentsByPostController,
//   deleteCommentController,
// } from './comment.controller';


// const router = Router();

// // Route to create a comment - only authenticated users
// router.post('/', createCommentController);

// // Route to get comments for a specific post
// router.get('/:postId', getCommentsByPostController);

// // Route to delete a comment - only the user who created the comment
// router.delete('/:commentId', deleteCommentController);

// export  default router;

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { commentController } from './comment.controller';
import { commentValidation } from './comment.validation';

const router = express.Router();

export const UserRoutes = router;

router.post(
  '/add-comment',
 
  validateRequest(commentValidation.createCommentValidationSchema),
  commentController.createComment
);// auth(USER_ROLE.ADMIN, USER_ROLE.USER),
router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),

  commentController.getAllComment
);
router.get(
  '/:commentId',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),

  commentController.getSingleComment
);

router.put(
  '/edit-comment/:commentId',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),

  commentController.editComment
);

router.delete(
  '/:commentId',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),

  commentController.deleteComment
);

export const commentRoutes = router;
