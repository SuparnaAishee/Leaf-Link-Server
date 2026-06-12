import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { USER_ROLE } from '../User/user.constant';
import { Event } from './event.model';
import { TEvent } from './event.interface';
import { notificationService } from '../Notification/notification.service';

const resolveUser = async (jwt: JwtPayload) => {
  const me = await User.findOne({ email: jwt.email });
  if (!me) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return me;
};

const createEvent = async (jwt: JwtPayload, payload: Partial<TEvent>) => {
  const me = await resolveUser(jwt);
  if (!payload?.title?.trim() || !payload?.date) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'title and date are required'
    );
  }
  return await Event.create({
    title: payload.title,
    description: payload.description,
    date: payload.date,
    location: payload.location,
    image: payload.image,
    host: me._id,
    attendees: [me._id],
  });
};

const listEvents = async (query: { scope?: 'upcoming' | 'past' | 'all' }) => {
  const scope = query.scope || 'upcoming';
  const now = new Date();
  const filter =
    scope === 'past'
      ? { date: { $lt: now } }
      : scope === 'all'
        ? {}
        : { date: { $gte: now } };
  return await Event.find(filter)
    .sort({ date: scope === 'past' ? -1 : 1 })
    .populate('host', 'name profilePhoto isVerified')
    .populate('attendees', 'name profilePhoto');
};

// Sidebar feed — small, fast, upcoming-only.
const listUpcomingForSidebar = async () => {
  const now = new Date();
  return await Event.find({ date: { $gte: now } })
    .sort({ date: 1 })
    .limit(3)
    .populate('host', 'name profilePhoto');
};

const getEvent = async (id: string) => {
  const ev = await Event.findById(id)
    .populate('host', 'name profilePhoto isVerified')
    .populate('attendees', 'name profilePhoto');
  if (!ev) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
  }
  return ev;
};

const updateEvent = async (
  jwt: JwtPayload,
  id: string,
  payload: Partial<TEvent>
) => {
  const me = await resolveUser(jwt);
  const ev = await Event.findById(id);
  if (!ev) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
  }
  if (ev.host.toString() !== me._id.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only the host can edit');
  }
  const allowed: Partial<TEvent> = {
    title: payload.title,
    description: payload.description,
    date: payload.date,
    location: payload.location,
    image: payload.image,
  };
  return await Event.findByIdAndUpdate(id, allowed, {
    new: true,
    runValidators: true,
  });
};

const deleteEvent = async (jwt: JwtPayload, id: string) => {
  const me = await resolveUser(jwt);
  const ev = await Event.findById(id);
  if (!ev) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
  }
  // Host can delete their own event; an ADMIN can delete any event (moderation).
  if (ev.host.toString() !== me._id.toString() && me.role !== USER_ROLE.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, 'Only the host can delete');
  }
  await Event.findByIdAndDelete(id);
  return { _id: id };
};

const toggleRsvp = async (jwt: JwtPayload, id: string) => {
  const me = await resolveUser(jwt);
  const ev = await Event.findById(id);
  if (!ev) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
  }
  const wasGoing = ev.attendees.some(
    (a) => a.toString() === me._id.toString()
  );
  const updated = await Event.findByIdAndUpdate(
    id,
    wasGoing
      ? { $pull: { attendees: me._id } }
      : { $addToSet: { attendees: me._id } },
    { new: true }
  );

  // Only notify the host on new RSVPs (not on un-RSVPs).
  if (!wasGoing && ev.host) {
    void notificationService.createNotification({
      recipient: ev.host as any,
      actor: me._id as any,
      type: 'rsvp',
      event: ev._id as any,
    });
  }

  return { event: updated, going: !wasGoing };
};

export const eventService = {
  createEvent,
  listEvents,
  listUpcomingForSidebar,
  getEvent,
  updateEvent,
  deleteEvent,
  toggleRsvp,
};
