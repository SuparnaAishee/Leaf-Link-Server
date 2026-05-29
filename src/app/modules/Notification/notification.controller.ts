import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { notificationService } from './notification.service';

const getMyNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.getMyNotifications(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notifications fetched',
    data: result,
  });
});

const getUnreadCount = catchAsync(async (req, res) => {
  const count = await notificationService.getMyUnreadCount(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Unread count',
    data: { count },
  });
});

const markAsRead = catchAsync(async (req, res) => {
  const result = await notificationService.markAsRead(req.user, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notification marked as read',
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All notifications marked as read',
    data: result,
  });
});

export const notificationController = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
