import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { eventService } from './event.service';

const createEvent = catchAsync(async (req, res) => {
  const result = await eventService.createEvent(req.user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Event created',
    data: result,
  });
});

const listEvents = catchAsync(async (req, res) => {
  const scope = (req.query.scope as 'upcoming' | 'past' | 'all') || 'upcoming';
  const result = await eventService.listEvents({ scope });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Events fetched',
    data: result,
  });
});

const listUpcomingForSidebar = catchAsync(async (_req, res) => {
  const result = await eventService.listUpcomingForSidebar();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Upcoming events',
    data: result,
  });
});

const getEvent = catchAsync(async (req, res) => {
  const result = await eventService.getEvent(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Event fetched',
    data: result,
  });
});

const updateEvent = catchAsync(async (req, res) => {
  const result = await eventService.updateEvent(
    req.user,
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Event updated',
    data: result,
  });
});

const deleteEvent = catchAsync(async (req, res) => {
  const result = await eventService.deleteEvent(req.user, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Event deleted',
    data: result,
  });
});

const toggleRsvp = catchAsync(async (req, res) => {
  const result = await eventService.toggleRsvp(req.user, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.going ? 'RSVPed' : 'RSVP removed',
    data: result,
  });
});

export const eventController = {
  createEvent,
  listEvents,
  listUpcomingForSidebar,
  getEvent,
  updateEvent,
  deleteEvent,
  toggleRsvp,
};
