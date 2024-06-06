"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }),
        phoneNumber: zod_1.z.string({ required_error: 'phoneNumber is required' }),
        whatsAppNumber: zod_1.z.string({ required_error: 'whatsAppNumber is required' }),
        telegramNumber: zod_1.z.string({ required_error: 'telegramNumber is required' }),
        userName: zod_1.z.string({ required_error: 'userName is required' }),
        country: zod_1.z.string({ required_error: 'country is required' }),
        address: zod_1.z.string({ required_error: 'address is required' }),
        state: zod_1.z.string({ required_error: 'state is required' }),
        city: zod_1.z.string({ required_error: 'city is required' }),
        birthDate: zod_1.z.string({ required_error: 'Birthday is required' }),
        meansOfIdentification: zod_1.z.enum([
            'PASSPORT',
            `DRIVER_LICENSE`,
            'NATIONAL_ID',
        ]),
        identificationNumber: zod_1.z.string({
            required_error: 'identificationNumber is required',
        }),
        identificationExpiredDate: zod_1.z
            .string({
            required_error: 'identificationExpiredDate is required',
        })
            .optional(),
        identityImage: zod_1.z.string({ required_error: 'identityImage is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }).optional(),
        userName: zod_1.z.string({ required_error: 'userName is required' }).optional(),
        country: zod_1.z.string({ required_error: 'country is required' }).optional(),
        address: zod_1.z.string({ required_error: 'address is required' }).optional(),
        state: zod_1.z.string({ required_error: 'state is required' }).optional(),
        city: zod_1.z.string({ required_error: 'city is required' }).optional(),
        birthDate: zod_1.z.string({ required_error: 'Birthday is required' }).optional(),
        messageByAdmin: zod_1.z
            .string({ required_error: 'messageByAdmin is required' })
            .optional(),
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
