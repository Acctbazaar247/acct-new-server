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
exports.KycService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const GenericEmailTemplates_1 = __importDefault(require("../../../shared/GenericEmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const kyc_constant_1 = require("./kyc.constant");
const getAllKyc = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm, email } = filters, filterData = __rest(filters, ["searchTerm", "email"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = kyc_constant_1.kycSearchableFields.map(single => {
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
    if (email) {
        const emailQuery = {
            AND: {
                ownBy: {
                    email,
                },
            },
        };
        andCondition.push(emailQuery);
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
    const result = yield prisma_1.default.kyc.findMany({
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
        include: {
            ownBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profileImg: true,
                    phoneNumber: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.kyc.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createKyc = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExits = yield prisma_1.default.kyc.findUnique({
        where: { ownById: payload.ownById },
        select: { id: true },
    });
    if (isExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Kyc Already exits');
    }
    if (payload.meansOfIdentification === 'PASSPORT') {
        if (!payload.identificationExpiredDate) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'identificationExpiredDate is required');
        }
    }
    const newKyc = yield prisma_1.default.kyc.create({
        data: payload,
    });
    return newKyc;
});
const getSingleKyc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.kyc.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const getSingleKycOfUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.kyc.findUnique({
        where: {
            ownById: id,
        },
    });
    return result;
});
const updateKyc = (id, payload, requestedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedUser = yield prisma_1.default.user.findUnique({
        where: { id: requestedUserId },
        select: {
            role: true,
            id: true,
        },
    });
    if (!requestedUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const isKycExits = yield prisma_1.default.kyc.findUnique({
        where: { id },
        select: {
            id: true,
            ownById: true,
            userName: true,
            name: true,
            ownBy: { select: { email: true, name: true } },
        },
    });
    if (!isKycExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Kyc not found!');
    }
    const isSeller = requestedUser.role === client_1.UserRole.seller;
    const isWantToUpdateStatus = payload.status === client_1.EStatusOfKyc.approved;
    if (isSeller && isWantToUpdateStatus) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You can not able to update this kyc!');
    }
    // check is own by this seller
    if (isSeller) {
        if (isKycExits.ownById !== requestedUser.id) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You can not able to update this kyc!');
        }
    }
    const byAdmin = requestedUser.role === client_1.UserRole.superAdmin;
    const statusIsApprove = payload.status === client_1.EStatusOfKyc.approved;
    if (byAdmin && statusIsApprove) {
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.user.update({
                where: { id: isKycExits.ownById },
                data: { isVerifiedByAdmin: true, userName: isKycExits.userName },
            });
            const updatedKyc = yield tx.kyc.update({ where: { id }, data: payload });
            return updatedKyc;
        }));
        (0, GenericEmailTemplates_1.default)({
            subject: `KYC Verification Approved`,
            title: `Hey ${isKycExits.ownBy.name}`,
            email: isKycExits.ownBy.email,
            description: `
       Congratulations! Your KYC verification has been approved.
        `,
        });
        return result;
    }
    if (byAdmin && payload.status === client_1.EStatusOfKyc.denied) {
        (0, GenericEmailTemplates_1.default)({
            subject: `KYC Verification Denied`,
            title: `Hey ${isKycExits.ownBy.name}`,
            email: isKycExits.ownBy.email,
            description: `
       We regret to inform you that your KYC verification has been denied. Please review the submission requirements and try again.
        `,
        });
    }
    // if (statusIsApprove) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot update status');
    // }
    const result = yield prisma_1.default.kyc.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteKyc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isKycExits = yield prisma_1.default.kyc.findUnique({
        where: { id },
        select: { id: true, status: true },
    });
    if (isKycExits && isKycExits.status === 'approved') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'you cannot delete approved kyc');
    }
    const result = yield prisma_1.default.kyc.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Kyc not found!');
    }
    return result;
});
exports.KycService = {
    getAllKyc,
    createKyc,
    updateKyc,
    getSingleKyc,
    deleteKyc,
    getSingleKycOfUser,
};
