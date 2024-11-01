import { CurrencyRequest, EStatusOfWithdrawalRequest } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';
import UpdateSellerAfterPay from '../../../helpers/UpdateSellerAfterPay';
import sendEmail from '../../../helpers/sendEmail';
import { EPaymentType } from '../../../interfaces/common';
import EmailTemplates from '../../../shared/EmailTemplates';
import catchAsync from '../../../shared/catchAsync';
import catchAsyncSemaphore from '../../../shared/catchAsyncSemaphore';
import pick from '../../../shared/pick';
import prisma from '../../../shared/prisma';
import sendResponse from '../../../shared/sendResponse';
import { WithdrawalRequestService } from '../withdrawalRequest/withdrawalRequest.service';
import { currencyRequestFilterAbleFields } from './currencyRequest.constant';
import { CurrencyRequestService } from './currencyRequest.service';
const createCurrencyRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CurrencyRequestData = req.body;
    const user = req.user as JwtPayload;

    const userInfo = await prisma.user.findFirst({
      where: { id: user.userId },
    });

    const result = await CurrencyRequestService.createCurrencyRequest({
      ...CurrencyRequestData,
      ownById: user.userId,
    });
    await sendEmail(
      { to: config.emailUser as string },
      {
        subject: EmailTemplates.requestForCurrencyToAdmin.subject,
        html: EmailTemplates.requestForCurrencyToAdmin.html({
          amount: result?.amount,
          userEmail: userInfo?.email,
          userName: userInfo?.name,
          userProfileImg: userInfo?.profileImg || '',
        }),
      }
    );
    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Created successfully!',
      data: result,
    });
  }
);
const createCurrencyRequestInvoice: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CurrencyRequestData = req.body;
    const user = req.user as JwtPayload;

    // const userInfo = await prisma.user.findFirst({
    //   where: { id: user.userId },
    // });

    const result = await CurrencyRequestService.createCurrencyRequestInvoice({
      ...CurrencyRequestData,
      ownById: user.userId,
    });
    // await sendEmail(
    //   { to: config.emailUser as string },
    //   {
    //     subject: EmailTemplates.requestForCurrencyToAdmin.subject,
    //     html: EmailTemplates.requestForCurrencyToAdmin.html({
    //       amount: result?.amount,
    //       userEmail: userInfo?.email,
    //       userName: userInfo?.name,
    //       userProfileImg: userInfo?.profileImg || '',
    //     }),
    //   }
    // );
    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Created successfully!',
      data: result,
    });
  }
);
const createCurrencyRequestWithPayStack: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CurrencyRequestData = req.body;
    const user = req.user as JwtPayload;

    const result =
      await CurrencyRequestService.createCurrencyRequestWithPayStack({
        ...CurrencyRequestData,
        ownById: user.userId,
      });
    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Created successfully!',
      data: result,
    });
  }
);

const getAllCurrencyRequest = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, [
      'searchTerm',
      ...currencyRequestFilterAbleFields,
    ]);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await CurrencyRequestService.getAllCurrencyRequest(
      filters,
      paginationOptions
    );

    sendResponse<CurrencyRequest[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved successfully !',
      meta: result.meta,
      data: result.data,
    });
  }
);

const payStackWebHook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const secretHash = config.flutterwave_hash;
    const signature = req.headers['verif-hash'];
    if (!signature || signature !== secretHash) {
      // This request isn't from Flutterwave; discard
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Only allowed from flutterwave'
      );
    }
    const ipnData = req.body;
    console.log({ ipnData }, 'webhook');
    if (ipnData.event === 'transfer.completed') {
      console.log('transfer.completed');
      if (
        ipnData.data.status === 'SUCCESSFUL' ||
        ipnData.data.status === 'successful'
      ) {
        console.log('withdraw completed');
        WithdrawalRequestService.updateWithdrawalRequest(
          ipnData.data.reference,
          { status: EStatusOfWithdrawalRequest.approved }
        );
      } else {
        console.log('withdraw failed');
        WithdrawalRequestService.updateWithdrawalRequest(
          ipnData.data.reference,
          { status: EStatusOfWithdrawalRequest.denied }
        );
      }
    } else if (ipnData.data.status === 'successful') {
      // const paymentReference = ipnData.data.reference;

      // Perform additional actions, such as updating your database, sending emails, etc.
      const paymentType = ipnData?.txRef.split('_$_')[0];
      if (paymentType === EPaymentType.addFunds) {
        await CurrencyRequestService.payStackWebHook({
          data: ipnData,
        });
      } else if (paymentType === EPaymentType.seller) {
        await UpdateSellerAfterPay({
          order_id: ipnData?.txRef.split('_$_')[1],
          payment_status: 'finished',
          price_amount: config.sellerOneTimePayment,
        });
      }
    }
    // eslint-disable-next-line no-console
    console.log({ ipnData }, 'webhook');
    // eslint-disable-next-line no-unused-vars

    sendResponse<string>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved  successfully!',
      data: 'success',
    });
  }
);
const getSingleCurrencyRequestIpn: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const ipnData = req.body;

    // eslint-disable-next-line no-unused-vars
    await CurrencyRequestService.createCurrencyRequestIpn(ipnData);

    sendResponse<string>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved  successfully!',
      data: 'succes',
    });
  }
);

const getSingleCurrencyRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CurrencyRequestService.getSingleCurrencyRequest(id);

    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest retrieved  successfully!',
      data: result,
    });
  }
);

const updateCurrencyRequest: RequestHandler = catchAsyncSemaphore(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = await CurrencyRequestService.updateCurrencyRequest(
      id,
      updateAbleData
    );

    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest Updated successfully!',
      data: result,
    });
  }
);
const deleteCurrencyRequest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CurrencyRequestService.deleteCurrencyRequest(id);

    sendResponse<CurrencyRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'CurrencyRequest deleted successfully!',
      data: result,
    });
  }
);

export const CurrencyRequestController = {
  getAllCurrencyRequest,
  createCurrencyRequest,
  updateCurrencyRequest,
  getSingleCurrencyRequest,
  deleteCurrencyRequest,
  createCurrencyRequestInvoice,
  getSingleCurrencyRequestIpn,
  createCurrencyRequestWithPayStack,
  payStackWebHook,
};
