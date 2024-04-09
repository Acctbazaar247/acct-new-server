"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        username: zod_1.z.string(),
        password: zod_1.z.string(),
        description: zod_1.z.string(),
        preview: zod_1.z.string().optional(),
        price: zod_1.z.number(),
        category: zod_1.z.nativeEnum(client_1.accountCategory),
        approvedForSale: zod_1.z
            .nativeEnum(client_1.EApprovedForSale)
            .default(client_1.EApprovedForSale.pending),
        isSold: zod_1.z.boolean().default(false),
    }),
});
const createValidationMulti = zod_1.z.object({
    body: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string(),
        username: zod_1.z.string(),
        password: zod_1.z.string(),
        description: zod_1.z.string(),
        preview: zod_1.z.string().optional(),
        price: zod_1.z.number(),
        category: zod_1.z.nativeEnum(client_1.accountCategory),
        approvedForSale: zod_1.z
            .nativeEnum(client_1.EApprovedForSale)
            .default(client_1.EApprovedForSale.pending),
        isSold: zod_1.z.boolean().default(false),
    }))
        .min(1),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        category: zod_1.z.nativeEnum(client_1.accountCategory).optional(),
        approvedForSale: zod_1.z.nativeEnum(client_1.EApprovedForSale).optional(),
        isSold: zod_1.z.boolean().optional(),
        ownById: zod_1.z.string().optional(),
        preview: zod_1.z.string().nullable().optional(),
    }),
});
exports.AccountValidation = {
    createValidation,
    updateValidation,
    createValidationMulti,
};
