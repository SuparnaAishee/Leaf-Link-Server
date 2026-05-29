import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { plantController } from './plant.controller';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  plantController.getMyPlants
);

router.get(
  '/due',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  plantController.getDuePlants
);

router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  plantController.createPlant
);

router.patch(
  '/:id/water',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  plantController.waterPlant
);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  plantController.updatePlant
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  plantController.deletePlant
);

export const plantRoutes = router;
