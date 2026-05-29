import express from 'express';
import { paymentController } from './payment.controller';

const router = express.Router();
// Payment gateway redirects users here after checkout — handle both methods.
router.post('/', paymentController.makePayment);
router.get('/', paymentController.makePayment);

export const successRoute = router;
