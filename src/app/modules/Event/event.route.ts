import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { eventController } from './event.controller';

const router = express.Router();

// Public: anyone can browse the events list / details.
router.get('/', eventController.listEvents);
router.get('/upcoming/list', eventController.listUpcomingForSidebar);
router.get('/:id', eventController.getEvent);

// Auth: create / edit / delete / RSVP.
router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  eventController.createEvent
);
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  eventController.updateEvent
);
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  eventController.deleteEvent
);
router.post(
  '/:id/rsvp',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  eventController.toggleRsvp
);

export const eventRoutes = router;
