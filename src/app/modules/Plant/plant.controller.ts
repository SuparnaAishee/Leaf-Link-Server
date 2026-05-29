import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { plantService } from './plant.service';

const createPlant = catchAsync(async (req, res) => {
  const result = await plantService.createPlant(req.user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Plant added',
    data: result,
  });
});

const getMyPlants = catchAsync(async (req, res) => {
  const result = await plantService.getMyPlants(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My plants',
    data: result,
  });
});

const getDuePlants = catchAsync(async (req, res) => {
  const result = await plantService.getDuePlants(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Plants due for water',
    data: result,
  });
});

const updatePlant = catchAsync(async (req, res) => {
  const result = await plantService.updatePlant(
    req.user,
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Plant updated',
    data: result,
  });
});

const waterPlant = catchAsync(async (req, res) => {
  const result = await plantService.waterPlant(req.user, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Watered',
    data: result,
  });
});

const deletePlant = catchAsync(async (req, res) => {
  const result = await plantService.deletePlant(req.user, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Plant removed',
    data: result,
  });
});

export const plantController = {
  createPlant,
  getMyPlants,
  getDuePlants,
  updatePlant,
  waterPlant,
  deletePlant,
};
