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
exports.CartService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const cart_constant_1 = require("./cart.constant");
const getAllCart = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = cart_constant_1.cartSearchableFields.map(single => {
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
    const result = yield prisma_1.default.cart.findMany({
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
    const total = yield prisma_1.default.cart.count();
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createCart = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is cart already exits
    const isAccountExits = yield prisma_1.default.account.findUnique({
        where: { id: payload.accountId },
    });
    if (!isAccountExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Account not found');
    }
    // checking user is the owner
    if (isAccountExits.ownById === payload.ownById) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You cannot add your created item to the cart!');
    }
    const isCartExist = yield prisma_1.default.cart.findFirst({
        where: {
            ownById: userId,
            accountId: payload.accountId,
        },
    });
    if (isCartExist === null || isCartExist === void 0 ? void 0 : isCartExist.id) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'cart already exits');
    }
    // check is
    const newCart = yield prisma_1.default.cart.create({
        data: payload,
        select: {
            accountId: true,
            createdAt: true,
            id: true,
            ownById: true,
            updatedAt: true,
            account: {
                select: {
                    id: true,
                    name: true,
                    accountType: true,
                    approvedForSale: true,
                    preview: true,
                    category: true,
                    createdAt: true,
                    updatedAt: true,
                    isSold: true,
                    price: true,
                    ownBy: {
                        select: {
                            email: true,
                            id: true,
                            name: true,
                            profileImg: true,
                            isVerifiedByAdmin: true,
                        },
                    },
                },
            },
            ownBy: {
                select: {
                    email: true,
                    id: true,
                    name: true,
                    profileImg: true,
                },
            },
        },
    });
    return newCart;
});
const getSingleUserCarts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.cart.findMany({
        where: {
            ownById: userId,
        },
        include: {
            account: {
                include: {
                    ownBy: true,
                },
            },
            ownBy: true,
        },
    });
    return result;
});
const getSingleCart = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.cart.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateCart = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.cart.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteCart = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.cart.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Cart not found!');
    }
    return result;
});
exports.CartService = {
    getAllCart,
    createCart,
    updateCart,
    getSingleCart,
    deleteCart,
    getSingleUserCarts,
};
