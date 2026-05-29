import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { aiScanService } from './aiScan.service';

const createScan = catchAsync(async (req, res) => {
  const result = await aiScanService.createScan(req.user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Scan saved',
    data: result,
  });
});

const getMyScans = catchAsync(async (req, res) => {
  const result = await aiScanService.getMyScans(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Scan history',
    data: result,
  });
});

const deleteScan = catchAsync(async (req, res) => {
  const result = await aiScanService.deleteScan(req.user, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Scan deleted',
    data: result,
  });
});

export const aiScanController = {
  createScan,
  getMyScans,
  deleteScan,
};
