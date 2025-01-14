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
exports.BusinessKycService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const GenericEmailTemplates_1 = __importDefault(require("../../../shared/GenericEmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const businessKyc_constant_1 = require("./businessKyc.constant");
const getAllBusinessKyc = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm, email } = filters, filterData = __rest(filters, ["searchTerm", "email"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = businessKyc_constant_1.businessKycSearchableFields.map(single => {
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
    const result = yield prisma_1.default.businessKyc.findMany({
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
                    badge: true,
                    badgeTitle: true,
                },
            },
            beneficialOwner: true,
        },
    });
    const total = yield prisma_1.default.businessKyc.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createBusinessKyc = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExits = yield prisma_1.default.businessKyc.findUnique({
        where: { ownById: payload.ownById },
        select: { id: true },
    });
    if (isExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Business Kyc Already exits');
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    // const {beneficialOwner,...rest}=payload
    // const result= await prisma.$transaction(async (tx)=>{
    //   const businessKyc= await tx.businessKyc.create({data:{}})
    // })
    // payload.beneficialOwner>>
    const beneficialOwner = payload.beneficialOwner;
    const data = Object.assign(Object.assign({}, payload), { beneficialOwner: {
            create: beneficialOwner,
        } });
    const newKyc = yield prisma_1.default.businessKyc.create({
        data,
        include: {
            beneficialOwner: true,
        },
    });
    return newKyc;
});
const getSingleBusinessKyc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.businessKyc.findUnique({
        where: {
            id,
        },
        include: {
            beneficialOwner: true,
            ownBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profileImg: true,
                    phoneNumber: true,
                    badge: true,
                    badgeTitle: true,
                },
            },
        },
    });
    return result;
});
const getSingleBusinessKycOfUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.businessKyc.findUnique({
        where: {
            ownById: id,
        },
        include: {
            beneficialOwner: true,
            ownBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profileImg: true,
                    phoneNumber: true,
                    badge: true,
                    badgeTitle: true,
                },
            },
        },
    });
    return result;
});
const updateBusinessKyc = (id, payload, requestedUserId) => __awaiter(void 0, void 0, void 0, function* () {
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
    const isKycExits = yield prisma_1.default.businessKyc.findUnique({
        where: { id },
        select: {
            id: true,
            ownById: true,
            businessName: true,
            ownBy: { select: { name: true, email: true } },
        },
    });
    if (!isKycExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Kyc not found!');
    }
    const isSeller = requestedUser.role === client_1.UserRole.seller;
    const isWantToUpdateStatus = payload.status === client_1.EStatusOfKyc.approved;
    if (isSeller && isWantToUpdateStatus) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You can not able to update this businessKyc!');
    }
    // check is own by this seller
    if (isSeller) {
        if (isKycExits.ownById !== requestedUser.id) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You can not able to update this businessKyc!');
        }
    }
    const byAdmin = requestedUser.role === client_1.UserRole.superAdmin;
    const statusIsApprove = payload.status === client_1.EStatusOfKyc.approved;
    if (byAdmin && statusIsApprove) {
        const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.user.update({
                where: { id: isKycExits.ownById },
                data: {
                    isVerifiedByAdmin: true,
                    isBusinessVerified: true,
                    badge: client_1.EBadge.blue,
                    userName: isKycExits.businessName,
                },
            });
            const updatedKyc = yield tx.businessKyc.update({
                where: { id },
                data: payload,
            });
            return updatedKyc;
        }));
        (0, GenericEmailTemplates_1.default)({
            subject: `KYC Verification Approved`,
            title: `Hey ${isKycExits.ownBy.name}`,
            email: isKycExits.ownBy.email,
            description: `
       Congratulations! Your Business KYC verification has been approved.
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
    if (payload.beneficialOwner) {
        const result = prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // delete previous all <br />
            yield tx.singleBeneficialOwners.deleteMany({
                where: { businessKycId: payload.id },
            });
            return yield tx.businessKyc.update({
                where: {
                    id,
                },
                data: Object.assign(Object.assign({}, payload), { beneficialOwner: {
                        create: (_a = payload.beneficialOwner) === null || _a === void 0 ? void 0 : _a.map(single => {
                            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
                            const { businessKycId } = single, rest = __rest(single, ["businessKycId"]);
                            return rest;
                        }),
                    } }),
            });
        }));
        return result;
    }
    const result = yield prisma_1.default.businessKyc.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteBusinessKyc = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isKycExits = yield prisma_1.default.businessKyc.findUnique({
        where: { id },
        select: { id: true, status: true },
    });
    if (isKycExits && isKycExits.status === 'approved') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'you cannot delete approved businessKyc');
    }
    const result = yield prisma_1.default.businessKyc.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Kyc not found!');
    }
    return result;
});
exports.BusinessKycService = {
    getAllBusinessKyc,
    createBusinessKyc,
    updateBusinessKyc,
    getSingleBusinessKyc,
    deleteBusinessKyc,
    getSingleBusinessKycOfUser,
};
