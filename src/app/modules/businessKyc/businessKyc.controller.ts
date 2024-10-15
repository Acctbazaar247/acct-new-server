import { BusinessKyc, EStatusOfKyc } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { businessKycFilterAbleFields } from './businessKyc.constant';
import { BusinessKycService } from './businessKyc.service';
const createBusinessKyc: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const BusinessKycData = req.body;
    const user = req.user as JwtPayload;
    const result = await BusinessKycService.createBusinessKyc({
      ...BusinessKycData,
      ownById: user.userId,
      status: EStatusOfKyc.pending,
    });
    sendResponse<BusinessKyc>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Business BusinessKyc Created successfully!',
      data: result,
    });
  }
);

const getAllBusinessKyc = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    ...businessKycFilterAbleFields,
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BusinessKycService.getAllBusinessKyc(
    filters,
    paginationOptions
  );

  sendResponse<BusinessKyc[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'BusinessKyc retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBusinessKyc: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BusinessKycService.getSingleBusinessKyc(id);

    sendResponse<BusinessKyc>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BusinessKyc retrieved  successfully!',
      data: result,
    });
  }
);
const getSingleBusinessKycOfUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;

    const result = await BusinessKycService.getSingleBusinessKycOfUser(
      user.userId
    );

    sendResponse<BusinessKyc>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BusinessKyc retrieved successfully!',
      data: result,
    });
  }
);

const updateBusinessKyc: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;
    const user = req.user as JwtPayload;

    const result = await BusinessKycService.updateBusinessKyc(
      id,
      updateAbleData,
      user.userId
    );

    sendResponse<BusinessKyc>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BusinessKyc Updated successfully!',
      data: result,
    });
  }
);
const deleteBusinessKyc: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BusinessKycService.deleteBusinessKyc(id);

    sendResponse<BusinessKyc>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'BusinessKyc deleted successfully!',
      data: result,
    });
  }
);

export const BusinessKycController = {
  getAllBusinessKyc,
  createBusinessKyc,
  updateBusinessKyc,
  getSingleBusinessKyc,
  deleteBusinessKyc,
  getSingleBusinessKycOfUser,
};
