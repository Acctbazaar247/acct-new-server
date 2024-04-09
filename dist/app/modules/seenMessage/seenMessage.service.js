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
exports.SeenMessageService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const currentTime_1 = __importDefault(require("../../../utils/currentTime"));
const seenMessage_constant_1 = require("./seenMessage.constant");
const getAllSeenMessage = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = seenMessage_constant_1.seenMessageSearchableFields.map(single => {
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
    const result = yield prisma_1.default.seenMessage.findMany({
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
    });
    const total = yield prisma_1.default.seenMessage.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createSeenMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExits = yield prisma_1.default.seenMessage.findFirst({
        where: {
            seenById: payload.seenById,
            orderId: payload.orderId,
        },
    });
    if (isExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Seen message already exits');
    }
    const newSeenMessage = yield prisma_1.default.seenMessage.create({
        data: payload,
    });
    return newSeenMessage;
});
const getSingleSeenMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.seenMessage.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateSeenMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    console.log('going to update seen message');
    const isSeenMessageExits = yield prisma_1.default.seenMessage.findFirst({
        where: {
            orderId: payload.orderId,
            seenById: payload.id,
        },
    });
    if (!isSeenMessageExits) {
        result = yield prisma_1.default.seenMessage.create({
            data: {
                orderId: payload.orderId,
                seenById: payload.id,
                lastSeen: (0, currentTime_1.default)(),
            },
        });
    }
    else {
        yield prisma_1.default.seenMessage.updateMany({
            where: {
                orderId: payload.orderId,
                seenById: payload.id,
            },
            data: { lastSeen: (0, currentTime_1.default)() },
        });
        result = yield prisma_1.default.seenMessage.findFirst({
            where: {
                orderId: payload.orderId,
                seenById: payload.id,
            },
        });
    }
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'try again letter');
    }
    return result;
});
const deleteSeenMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.seenMessage.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'SeenMessage not found!');
    }
    return result;
});
exports.SeenMessageService = {
    getAllSeenMessage,
    createSeenMessage,
    updateSeenMessage,
    getSingleSeenMessage,
    deleteSeenMessage,
};
