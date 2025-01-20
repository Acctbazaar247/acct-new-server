import { ECryptoType } from '@prisma/client';
import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    walletAddress: z.string({ required_error: 'Wallet address is required' }),
    cryptoType: z
      .enum([...Object.keys(ECryptoType)] as [string, ...string[]])
      .optional(),
    isTrc: z.boolean().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});
const updateValidation = z.object({
  body: z.object({
    walletAddress: z.string().optional(),
    cryptoType: z
      .enum([...Object.keys(ECryptoType)] as [string, ...string[]])
      .optional(),
    isTrc: z.boolean().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});
export const CryptoBankValidation = {
  createValidation,
  updateValidation,
};
