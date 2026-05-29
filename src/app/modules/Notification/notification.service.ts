import { JwtPayload } from 'jsonwebtoken';
import { Notification } from './notification.model';
import { TNotification } from './notification.interface';
import { User } from '../User/user.model';

type NotificationInput = Omit<TNotification, 'read' | 'createdAt' | 'updatedAt'>;

// Used by other services as a fire-and-forget side effect when something
// notification-worthy happens (follow, comment, upvote, premium activation).
// We never want a failing notification write to abort the parent action,
// so all errors are swallowed and logged.
const createNotification = async (input: NotificationInput) => {
  try {
    // Don't notify users about their own actions.
    if (
      input.actor &&
      input.recipient.toString() === input.actor.toString()
    ) {
      return null;
    }
    return await Notification.create({ ...input, read: false });
  } catch (err) {
    console.error('[notification] failed to create:', err);
    return null;
  }
};

const getMyNotifications = async (user: JwtPayload) => {
  const me = await User.findOne({ email: user.email });
  if (!me) return [];
  return await Notification.find({ recipient: me._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('actor', 'name profilePhoto isVerified')
    .populate('post', 'title imageUrl')
    .populate('comment', 'comment');
};

const getMyUnreadCount = async (user: JwtPayload) => {
  const me = await User.findOne({ email: user.email });
  if (!me) return 0;
  return await Notification.countDocuments({
    recipient: me._id,
    read: false,
  });
};

const markAsRead = async (user: JwtPayload, id: string) => {
  const me = await User.findOne({ email: user.email });
  if (!me) return null;
  return await Notification.findOneAndUpdate(
    { _id: id, recipient: me._id },
    { read: true },
    { new: true }
  );
};

const markAllAsRead = async (user: JwtPayload) => {
  const me = await User.findOne({ email: user.email });
  if (!me) return { modifiedCount: 0 };
  return await Notification.updateMany(
    { recipient: me._id, read: false },
    { read: true }
  );
};

export const notificationService = {
  createNotification,
  getMyNotifications,
  getMyUnreadCount,
  markAsRead,
  markAllAsRead,
};
