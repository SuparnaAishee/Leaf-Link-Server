import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IVerifyProfile } from './verifyProfile.interface';
import { VerifyProfile } from './verifyProfile.model';
import { User } from '../User/user.model';
import { initiatePayment } from '../payment/payment.utils';

const verifyProfile = async (payload: IVerifyProfile) => {
  const isUserExist = await User.findById(payload.user);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  const transactionId = `TXN-${Date.now()}`;

  const paymentData = {
    transactionId,
    amount: payload.amount,
    customerName: isUserExist.name,
    customerMobileNo: isUserExist.mobileNumber,
    customerEmail: isUserExist.email,
  };
  payload.transactionId = transactionId;
  payload.isPaid = true;
  payload.date = new Date();

  // Single create — no need for a transaction wrapper.
  // (The previous mongoose.startSession() flow only works on a replica set;
  // standalone local Mongo throws "Transaction numbers are only allowed on a replica set member or mongos".)
  await VerifyProfile.create(payload);

  const paymentSession = await initiatePayment(paymentData);
  return paymentSession;
};

export const verifyProfileService = {
  verifyProfile,
};
