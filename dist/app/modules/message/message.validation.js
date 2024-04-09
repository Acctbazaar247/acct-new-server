"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string({ required_error: 'orderId is required' }),
        text: zod_1.z
            .string({ required_error: 'text is required' })
            .optional()
            .nullable(),
        image: zod_1.z
            .string({ required_error: 'image is required' })
            .optional()
            .nullable(),
        sendBy: zod_1.z
            .object({
            email: zod_1.z.string(),
            id: zod_1.z.string(),
            name: zod_1.z.string(),
            profileImg: zod_1.z.string(),
        })
            .optional()
            .nullable(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.MessageValidation = {
    createValidation,
    updateValidation,
};
