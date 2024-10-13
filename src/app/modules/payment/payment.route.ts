import express from 'express';
import { paymentController } from './payment.controller';

const router = express.Router();
router.get('/', paymentController.getAllPayment);

export const paymentRoute = router;
