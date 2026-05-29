import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { aiScanController } from './aiScan.controller';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  aiScanController.getMyScans
);

router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  aiScanController.createScan
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  aiScanController.deleteScan
);

export const aiScanRoutes = router;
