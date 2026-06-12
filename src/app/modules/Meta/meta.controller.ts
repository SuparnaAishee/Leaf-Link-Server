import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { metaService } from './meta.service';

const getAdminStats = catchAsync(async (req, res) => {
  const result = await metaService.getAdminStats();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin dashboard stats fetched',
    data: result,
  });
});

export const metaController = { getAdminStats };
