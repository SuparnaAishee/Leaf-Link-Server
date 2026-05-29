import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { notificationController } from './notification.controller';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  notificationController.getMyNotifications
);

router.get(
  '/unread-count',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  notificationController.getUnreadCount
);

router.patch(
  '/read-all',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  notificationController.markAllAsRead
);

router.patch(
  '/:id/read',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  notificationController.markAsRead
);

export const notificationRoutes = router;
