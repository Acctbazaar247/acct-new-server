"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalRequestValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const config_1 = __importDefault(require("../../../config"));
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z
            .number()
            .min(config_1.default.withdrawalMinMoney)
            .max(config_1.default.withdrawalMaxMoney),
        fullName: zod_1.z.string().optional(),
        accountNumber: zod_1.z.string().optional(),
        bankName: zod_1.z.string().optional(),
        walletAddress: zod_1.z.string().optional(),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([...Object.values(client_1.EStatusOfWithdrawalRequest)]),
        message: zod_1.z.string().optional(),
    }),
});
exports.WithdrawalRequestValidation = {
    createValidation,
    updateValidation,
};
