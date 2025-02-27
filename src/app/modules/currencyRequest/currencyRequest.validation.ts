import { EStatusOfCurrencyRequest } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    amount: z.number({ required_error: 'amount is required' }).min(0),
    pay_currency_btc: z.boolean().optional().default(false),
    message: z.string({ required_error: 'message is required' }).optional(),
  }),
});
const createValidationForOx = z.object({
  body: z.object({
    amount: z.number({ required_error: 'amount is required' }).min(0),
    pay_currency_btc: z.boolean().optional().default(false),
    currency: z.string({ required_error: 'currency is required' }),
    message: z.string({ required_error: 'message is required' }).optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    amount: z
      .number({ required_error: 'amount is required' })
      .min(0)
      .optional(),
    message: z.string({ required_error: 'message is required' }).optional(),
    status: z.nativeEnum(EStatusOfCurrencyRequest).optional(),
  }),
});
export const CurrencyRequestValidation = {
  createValidation,
  updateValidation,
  createValidationForOx,
};
