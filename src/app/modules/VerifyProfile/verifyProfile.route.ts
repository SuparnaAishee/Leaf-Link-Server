import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
// import auth from '../../middlewares/auth';
// import { USER_ROLE } from '../User/user.constant';

import { verifyProfileController } from './verifyProfile.controller';
import { createVerifyProfileValidationSchema } from './verifyProfile.validation';

const router = express.Router();
router.post(
  '/',
 
  validateRequest(createVerifyProfileValidationSchema),
  verifyProfileController.verifyProfile
);// auth(USER_ROLE.USER),

export const verifyProfileRoute = router;
