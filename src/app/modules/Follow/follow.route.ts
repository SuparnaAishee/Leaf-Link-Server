import express from 'express';
import { USER_ROLE } from '../User/user.constant';

import { followValidationSchema } from './follow.validation';

import { followController } from './follow.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.put(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validateRequest(followValidationSchema),
  followController.followUser
);

export const followRoutes = router;
