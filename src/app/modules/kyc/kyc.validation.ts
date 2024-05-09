import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    country: z.string({ required_error: 'country is required' }),
    address: z.string({ required_error: 'address is required' }),
    state: z.string({ required_error: 'state is required' }),
    city: z.string({ required_error: 'city is required' }),
    birthDate: z.string({ required_error: 'Birthday is required' }),
    meansOfIdentification: z.string({
      required_error: 'meansOfIdentification is required',
    }),
    identificationNumber: z.string({
      required_error: 'identificationNumber is required',
    }),
    identityImage: z.string({ required_error: 'identityImage is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    country: z.string({ required_error: 'country is required' }).optional(),
    address: z.string({ required_error: 'address is required' }).optional(),
    state: z.string({ required_error: 'state is required' }).optional(),
    city: z.string({ required_error: 'city is required' }).optional(),
    birthDate: z.string({ required_error: 'Birthday is required' }).optional(),
    meansOfIdentification: z
      .string({
        required_error: 'meansOfIdentification is required',
      })
      .optional(),
    identificationNumber: z
      .string({
        required_error: 'identificationNumber is required',
      })
      .optional(),
    identityImage: z
      .string({ required_error: 'identityImage is required' })
      .optional(),
  }),
});
export const KycValidation = {
  createValidation,
  updateValidation,
};
