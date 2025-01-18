import { EStatusOfManualCurrencyRequest } from '@prisma/client';
import { z } from 'zod';
import config from '../../../config';

// account name and bankName is required when account number is provided
// wallet address is required when account number is not provided
const createValidation = z.object({
  body: z.object({
    requestedAmount: z
      .number()
      .min(config.withdrawalMinMoney)
      .max(config.withdrawalMaxMoney),
    receivedAmount: z.number().optional(),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    walletAddress: z.string().optional(),
    dollarRate: z.number().optional(),
    isTrc: z.boolean().optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    status: z.enum([...Object.values(EStatusOfManualCurrencyRequest)] as [
      string,
      ...string[]
    ]),
    message: z.string().optional(),
  }),
});
export const ManualCurrencyRequestValidation = {
  createValidation,
  updateValidation,
};
