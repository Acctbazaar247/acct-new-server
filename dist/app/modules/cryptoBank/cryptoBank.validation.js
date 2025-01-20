"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoBankValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        walletAddress: zod_1.z.string({ required_error: 'Wallet address is required' }),
        cryptoType: zod_1.z
            .enum([...Object.keys(client_1.ECryptoType)])
            .optional(),
        isTrc: zod_1.z.boolean().optional().nullable(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        walletAddress: zod_1.z.string().optional(),
        cryptoType: zod_1.z
            .enum([...Object.keys(client_1.ECryptoType)])
            .optional(),
        isTrc: zod_1.z.boolean().optional().nullable(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.CryptoBankValidation = {
    createValidation,
    updateValidation,
};
