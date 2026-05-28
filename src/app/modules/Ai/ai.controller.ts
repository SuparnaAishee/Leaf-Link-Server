import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { aiService } from './ai.service';

const identifyPlant = catchAsync(async (req, res) => {
  const { imageUrl, imageBase64, hint } = req.body;
  const result = await aiService.identifyPlant({ imageUrl, imageBase64, hint });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Plant identified',
    data: result,
  });
});

const diagnoseDisease = catchAsync(async (req, res) => {
  const { imageUrl, imageBase64, symptoms } = req.body;
  const result = await aiService.diagnoseDisease({ imageUrl, imageBase64, symptoms });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Diagnosis ready',
    data: result,
  });
});

const chat = catchAsync(async (req, res) => {
  const { messages } = req.body;
  const result = await aiService.chat(messages);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reply ready',
    data: result,
  });
});

export const aiController = { identifyPlant, diagnoseDisease, chat };
