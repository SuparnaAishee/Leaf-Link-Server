import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
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

// Extracts @handles from free-text and notifies each matching user.
// Handles are matched case-insensitively against the user's name with
// spaces removed, mirroring the client's @-mention display rule
// (e.g. "Suparna Dhar" → @suparnadhar).
const notifyMentions = async (params: {
  text: string;
  actor: Types.ObjectId;
  post?: Types.ObjectId;
  comment?: Types.ObjectId;
}) => {
  try {
    const handles = Array.from(
      new Set(
        (params.text.match(/@[a-zA-Z0-9_]+/g) || []).map((h) =>
          h.slice(1).toLowerCase()
        )
      )
    );
    if (handles.length === 0) return;

    // The user list isn't huge in this project, so a single scan is fine.
    // For a larger app we'd want an indexed `handle` column.
    const users = await User.find({}, { name: 1 });
    const matched = users.filter((u) =>
      handles.includes((u.name || '').toLowerCase().replace(/\s+/g, ''))
    );

    await Promise.all(
      matched.map((u) =>
        createNotification({
          recipient: u._id as any,
          actor: params.actor,
          type: 'mention',
          post: params.post,
          comment: params.comment,
        })
      )
    );
  } catch (err) {
    console.error('[notification] mention scan failed:', err);
  }
};

export const notificationService = {
  createNotification,
  notifyMentions,
  getMyNotifications,
  getMyUnreadCount,
  markAsRead,
  markAllAsRead,
};
