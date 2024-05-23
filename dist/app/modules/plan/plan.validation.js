"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        planType: zod_1.z.enum([...Object.values(client_1.EPlanType)]),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.PlanValidation = {
    createValidation,
    updateValidation,
};
