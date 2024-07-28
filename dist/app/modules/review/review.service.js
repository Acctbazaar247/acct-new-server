"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const review_constant_1 = require("./review.constant");
const getAllReview = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = review_constant_1.reviewSearchableFields.map(single => {
            const query = {
                [single]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            };
            return query;
        });
        andCondition.push({
            OR: searchAbleFields,
        });
    }
    if (Object.keys(filters).length) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.review.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        select: {
            id: true,
            accountId: true,
            sellerId: true,
            seller: {
                select: { id: true, name: true, profileImg: true },
            },
            ownById: true,
            createdAt: true,
            updatedAt: true,
            reviewText: true,
            reviewStatus: true,
            isAnonymous: true,
            ReviewReply: {
                select: {
                    id: true,
                    reply: true,
                    ownById: true,
                    createdAt: true,
                    ownBy: {
                        select: {
                            name: true,
                            id: true,
                            profileImg: true,
                        },
                    },
                },
            },
            ownBy: {
                select: { id: true, email: true, profileImg: true, name: true },
            },
        },
    });
    const total = yield prisma_1.default.review.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newReview = yield prisma_1.default.review.createMany({
        data: payload,
    });
    return newReview;
});
const createReviewReply = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isReviewExits = yield prisma_1.default.review.findUnique({
        where: { id: payload.reviewId },
    });
    if (!isReviewExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Review not found to reply');
    }
    // check the person is he relative to the conversation
    const isNotSeller = isReviewExits.sellerId !== payload.ownById;
    const isNotBuyer = isReviewExits.ownById !== payload.ownById;
    if (isNotBuyer && isNotSeller) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You are not allowed to reply on this conversation');
    }
    const newReview = yield prisma_1.default.reviewReply.create({
        data: payload,
    });
    return newReview;
});
const getSingleReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateReview = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Review not found!');
    }
    return result;
});
exports.ReviewService = {
    getAllReview,
    createReview,
    updateReview,
    getSingleReview,
    deleteReview,
    createReviewReply,
};
