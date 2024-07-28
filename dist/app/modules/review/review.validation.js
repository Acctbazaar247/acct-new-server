"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.array(zod_1.z.object({
        sellerId: zod_1.z.string({ required_error: 'Seller id is required!' }),
        accountId: zod_1.z.string({ required_error: 'accountId   is required!' }),
        reviewText: zod_1.z.string({ required_error: 'reviewText is required!' }),
        isAnonymous: zod_1.z.boolean({ required_error: 'isAnonymous is required!' }),
        reviewStatus: zod_1.z.enum([...Object.values(client_1.EReviewStatus)]),
    })),
});
const createReplyValidation = zod_1.z.object({
    body: zod_1.z.array(zod_1.z.object({
        reviewId: zod_1.z.string({ required_error: 'Review id is required!' }),
        reply: zod_1.z.string({ required_error: 'reviewText is required!' }),
    })),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({}),
});
exports.ReviewValidation = {
    createValidation,
    createReplyValidation,
    updateValidation,
};
