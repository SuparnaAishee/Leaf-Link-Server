import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { metaController } from './meta.controller';

const router = express.Router();

router.get('/admin-stats', auth(USER_ROLE.ADMIN), metaController.getAdminStats);

export const metaRoutes = router;
