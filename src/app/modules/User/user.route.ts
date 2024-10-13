import express from 'express';
import { UserControllers } from './user.controller';

// import { USER_ROLE } from './user.constant';

import { UserValidation } from './user.validation';
// import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';


const router = express.Router();

export const UserRoutes = router;

router.post(
  '/create-user',

  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.userRegister
);//  auth(USER_ROLE.ADMIN),
router.get(
  '/',
 
  UserControllers.getAllUsers
);// auth(USER_ROLE.ADMIN, USER_ROLE.USER),
router.get('/:id', UserControllers.getSingleUser);
router.put('/update-user/:userId', UserControllers.updateUser);