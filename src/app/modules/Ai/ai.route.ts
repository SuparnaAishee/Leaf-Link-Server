import express from 'express';
import { aiController } from './ai.controller';

const router = express.Router();

router.post('/identify', aiController.identifyPlant);
router.post('/diagnose', aiController.diagnoseDisease);
router.post('/chat', aiController.chat);

export const aiRoutes = router;
