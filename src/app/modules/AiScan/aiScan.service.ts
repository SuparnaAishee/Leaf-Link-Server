import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { AiScan } from './aiScan.model';
import { TAiScan } from './aiScan.interface';

const resolveUser = async (jwt: JwtPayload) => {
  const me = await User.findOne({ email: jwt.email });
  if (!me) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return me;
};

const createScan = async (jwt: JwtPayload, payload: Partial<TAiScan>) => {
  const me = await resolveUser(jwt);
  if (!payload?.kind) {
    throw new AppError(httpStatus.BAD_REQUEST, 'kind is required');
  }
  return await AiScan.create({ ...payload, user: me._id });
};

const getMyScans = async (jwt: JwtPayload) => {
  const me = await resolveUser(jwt);
  return await AiScan.find({ user: me._id }).sort({ createdAt: -1 }).limit(50);
};

const deleteScan = async (jwt: JwtPayload, id: string) => {
  const me = await resolveUser(jwt);
  const scan = await AiScan.findOne({ _id: id, user: me._id });
  if (!scan) {
    throw new AppError(httpStatus.NOT_FOUND, 'Scan not found');
  }
  await AiScan.findByIdAndDelete(id);
  return { _id: id };
};

export const aiScanService = {
  createScan,
  getMyScans,
  deleteScan,
};
