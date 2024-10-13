import express from 'express';


import { followValidationSchema } from './follow.validation';

import { followController } from './follow.controller';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validateRequest(followValidationSchema),
  followController.followUser
);// 

 
export const followRoutes = router;
