"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        country: zod_1.z.string({ required_error: 'country is required' }),
        address: zod_1.z.string({ required_error: 'address is required' }),
        state: zod_1.z.string({ required_error: 'state is required' }),
        city: zod_1.z.string({ required_error: 'city is required' }),
        birthDate: zod_1.z.string({ required_error: 'Birthday is required' }),
        meansOfIdentification: zod_1.z.string({
            required_error: 'meansOfIdentification is required',
        }),
        identificationNumber: zod_1.z.string({
            required_error: 'identificationNumber is required',
        }),
        identityImage: zod_1.z.string({ required_error: 'identityImage is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        country: zod_1.z.string({ required_error: 'country is required' }).optional(),
        address: zod_1.z.string({ required_error: 'address is required' }).optional(),
        state: zod_1.z.string({ required_error: 'state is required' }).optional(),
        city: zod_1.z.string({ required_error: 'city is required' }).optional(),
        birthDate: zod_1.z.string({ required_error: 'Birthday is required' }).optional(),
        meansOfIdentification: zod_1.z
            .string({
            required_error: 'meansOfIdentification is required',
        })
            .optional(),
        identificationNumber: zod_1.z
            .string({
            required_error: 'identificationNumber is required',
        })
            .optional(),
        identityImage: zod_1.z
            .string({ required_error: 'identityImage is required' })
            .optional(),
    }),
});
exports.KycValidation = {
    createValidation,
    updateValidation,
};
