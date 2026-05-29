import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { Plant } from './plant.model';
import { TPlant } from './plant.interface';

const resolveUser = async (jwt: JwtPayload) => {
  const me = await User.findOne({ email: jwt.email });
  if (!me) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return me;
};

const createPlant = async (jwt: JwtPayload, payload: Partial<TPlant>) => {
  const me = await resolveUser(jwt);
  if (!payload?.name?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'name is required');
  }
  return await Plant.create({ ...payload, user: me._id });
};

const getMyPlants = async (jwt: JwtPayload) => {
  const me = await resolveUser(jwt);
  return await Plant.find({ user: me._id }).sort({ createdAt: -1 });
};

const getDuePlants = async (jwt: JwtPayload) => {
  // Returns plants whose lastWateredAt + waterIntervalDays is <= now.
  // Mongo aggregation keeps this in one query.
  const me = await resolveUser(jwt);
  return await Plant.aggregate([
    { $match: { user: me._id } },
    {
      $addFields: {
        nextWaterAt: {
          $dateAdd: {
            startDate: { $ifNull: ['$lastWateredAt', '$plantedAt'] },
            unit: 'day',
            amount: { $ifNull: ['$waterIntervalDays', 7] },
          },
        },
      },
    },
    { $match: { nextWaterAt: { $lte: new Date() } } },
    { $sort: { nextWaterAt: 1 } },
  ]);
};

const updatePlant = async (
  jwt: JwtPayload,
  id: string,
  payload: Partial<TPlant>
) => {
  const me = await resolveUser(jwt);
  const plant = await Plant.findOne({ _id: id, user: me._id });
  if (!plant) {
    throw new AppError(httpStatus.NOT_FOUND, 'Plant not found');
  }
  // Lock the owner — only allow whitelisted fields to change.
  const allowed: Partial<TPlant> = {
    name: payload.name,
    species: payload.species,
    photo: payload.photo,
    plantedAt: payload.plantedAt,
    waterIntervalDays: payload.waterIntervalDays,
    fertilizeIntervalDays: payload.fertilizeIntervalDays,
    notes: payload.notes,
  };
  return await Plant.findByIdAndUpdate(id, allowed, {
    new: true,
    runValidators: true,
  });
};

const waterPlant = async (jwt: JwtPayload, id: string) => {
  const me = await resolveUser(jwt);
  const plant = await Plant.findOne({ _id: id, user: me._id });
  if (!plant) {
    throw new AppError(httpStatus.NOT_FOUND, 'Plant not found');
  }
  plant.lastWateredAt = new Date();
  await plant.save();
  return plant;
};

const deletePlant = async (jwt: JwtPayload, id: string) => {
  const me = await resolveUser(jwt);
  const plant = await Plant.findOne({ _id: id, user: me._id });
  if (!plant) {
    throw new AppError(httpStatus.NOT_FOUND, 'Plant not found');
  }
  await Plant.findByIdAndDelete(id);
  return { _id: id };
};

export const plantService = {
  createPlant,
  getMyPlants,
  getDuePlants,
  updatePlant,
  waterPlant,
  deletePlant,
};
