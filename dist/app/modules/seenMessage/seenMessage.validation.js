"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeenMessageValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string({ required_error: 'groupId is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string({ required_error: 'orderId is required' }),
    }),
});
exports.SeenMessageValidation = {
    createValidation,
    updateValidation,
};
