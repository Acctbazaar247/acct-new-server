"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.PlanService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const plan_constant_1 = require("./plan.constant");
const plan_utils_1 = __importStar(require("./plan.utils"));
const getAllPlan = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm, isActive } = filters, filterData = __rest(filters, ["searchTerm", "isActive"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = plan_constant_1.planSearchableFields.map(single => {
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
    if (isActive) {
        andCondition.push({
            AND: {
                isActive: JSON.parse(isActive),
            },
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.plan.findMany({
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
            createdAt: true,
            id: true,
            days: true,
            isActive: true,
            limit: true,
            planType: true,
            ownById: true,
            updatedAt: true,
            ownBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profileImg: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.plan.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createPlan = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // check does he has active plan
    const isActivePlanExits = yield prisma_1.default.plan.findFirst({
        where: {
            isActive: true,
            ownById: userId,
        },
    });
    if (isActivePlanExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You already have a active plan');
    }
    // check wallet of user
    const isCurrencyExits = yield prisma_1.default.currency.findUnique({
        where: { ownById: userId },
    });
    if (!isCurrencyExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User wallet not found');
    }
    let price;
    let limit;
    let days;
    if (payload.planType === client_1.EPlanType.pro) {
        if (isCurrencyExits.amount < config_1.default.proPlanPrice) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not enough money left in wallet');
        }
        price = config_1.default.proPlanPrice;
        limit = config_1.default.proPlanLimit;
        days = config_1.default.proPlanDays;
    }
    else if (payload.planType === client_1.EPlanType.proPlus) {
        if (isCurrencyExits.amount < config_1.default.proPlusPlanPrice) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not enough money left in wallet');
        }
        price = config_1.default.proPlusPlanPrice;
        limit = config_1.default.proPlusPlanLimit;
        days = config_1.default.proPlusPlanDays;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You request is not valid');
    }
    // cut money from the user and add it to admin
    const isAdminExist = yield prisma_1.default.user.findUnique({
        where: { email: config_1.default.mainAdminEmail },
        select: { id: true },
    });
    if (!isAdminExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong try again latter');
    }
    const newPlan = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // delete previous plan
        yield tx.plan.delete({ where: { ownById: userId } });
        // cut money form user
        yield tx.currency.update({
            where: { ownById: userId },
            data: {
                amount: {
                    decrement: price,
                },
            },
        });
        // add money to admin
        yield tx.currency.update({
            where: { ownById: isAdminExist.id },
            data: {
                amount: {
                    increment: price,
                },
            },
        });
        const result = yield tx.plan.create({
            data: Object.assign(Object.assign({}, payload), { ownById: userId, isActive: true, limit,
                days }),
        });
        return result;
    }));
    return newPlan;
});
const getSinglePlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.plan.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const getActivePlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.plan.findUnique({
        where: {
            ownById: id,
            isActive: true,
        },
    });
    if (!result) {
        return {
            id,
            ownById: id,
            isActive: true,
            planType: 'basic',
            limit: config_1.default.basicPlanLimit,
            days: 'life time',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    // check if time is up then update the plan to in active
    if (!(0, plan_utils_1.default)(result.createdAt, result.days)) {
        const update = yield prisma_1.default.plan.update({
            where: { ownById: id },
            data: { isActive: false },
        });
        if (update.isActive) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Try again latter');
        }
    }
    return result;
});
const getHowManyUploadLeft = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield (0, plan_utils_1.getAccountsUploadedToday)(id);
    // calculate amount in here
    const isPlanExist = yield prisma_1.default.plan.findUnique({ where: { ownById: id } });
    let totalPossibleUpload = 0;
    if (!isPlanExist) {
        totalPossibleUpload = config_1.default.basicPlanLimit;
    }
    else {
        totalPossibleUpload = isPlanExist.limit;
    }
    return { uploaded: count, left: Math.max(totalPossibleUpload - count, 0) };
});
const updatePlan = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.plan.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deletePlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.plan.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Plan not found!');
    }
    return result;
});
exports.PlanService = {
    getAllPlan,
    createPlan,
    updatePlan,
    getSinglePlan,
    deletePlan,
    getActivePlan,
    getHowManyUploadLeft,
};
