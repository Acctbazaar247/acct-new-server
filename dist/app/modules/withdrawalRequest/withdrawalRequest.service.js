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
exports.WithdrawalRequestService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const lodash_1 = require("lodash");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const GenericEmailTemplates_1 = __importDefault(require("../../../shared/GenericEmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const calculation_1 = require("../../../utils/calculation");
const withdrawalRequest_constant_1 = require("./withdrawalRequest.constant");
const withdrawalRequest_utils_1 = require("./withdrawalRequest.utils");
const getAllWithdrawalRequest = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = withdrawalRequest_constant_1.withdrawalRequestSearchableFields.map(single => {
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
    const result = yield prisma_1.default.withdrawalRequest.findMany({
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
                    name: true,
                    email: true,
                    id: true,
                    phoneNumber: true,
                    profileImg: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.withdrawalRequest.count({
        where: whereConditions,
    });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createWithdrawalRequest = (payload, requestBy, withdrawalPin) => __awaiter(void 0, void 0, void 0, function* () {
    const MAIN_ADMIN_EMAIL = config_1.default.mainAdminEmail;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { id: requestBy.userId },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found!');
    }
    if (!isUserExist.withdrawalPin) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Add a withdrawal pin first');
    }
    if (!(yield bcryptjs_1.default.compare(withdrawalPin, isUserExist.withdrawalPin))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Withdrawal pin does not match!');
    }
    if (isUserExist.email === MAIN_ADMIN_EMAIL) {
        // check does this request is made from main admin
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Admin cannot able to withdraw money');
        // const newWithdrawalRequest = await prisma.$transaction(async tx => {
        //   // get previous currency
        //   const preCurrency = await tx.currency.findFirst({
        //     where: { ownById: isUserExist.id },
        //   });
        //   if (!preCurrency) {
        //     throw new ApiError(
        //       httpStatus.BAD_REQUEST,
        //       'Currency not found for this admin'
        //     );
        //   }
        //   if (preCurrency.amount < payload.amount) {
        //     throw new ApiError(
        //       httpStatus.BAD_REQUEST,
        //       "That much amount doesn't exist"
        //     );
        //   }
        //   // delete same monkey from the admin
        //   await tx.currency.update({
        //     where: { ownById: isUserExist.id },
        //     data: {
        //       amount: round(
        //         preCurrency.amount - payload.amount,
        //         config.calculationMoneyRound
        //       ),
        //     },
        //   });
        //   return await tx.withdrawalRequest.create({
        //     data: { ...payload, status: EStatusOfWithdrawalRequest.approved },
        //   });
        // });
        // return newWithdrawalRequest;
    }
    else {
        // for normal user seller and not main admin
        const newWithdrawalRequest = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // get the user currency
            const preCurrency = yield tx.currency.findFirst({
                where: { ownById: isUserExist.id },
            });
            if (!preCurrency) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Currency not found');
            }
            const amountToCut = (0, calculation_1.incrementByPercentage)(payload.amount, config_1.default.withdrawalPercentage);
            if (preCurrency.amount < amountToCut) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "That much amount doesn't exist");
            }
            // cut monkey
            yield tx.currency.update({
                where: { ownById: isUserExist.id },
                data: {
                    amount: {
                        decrement: amountToCut,
                    },
                },
            });
            // create withdrawal request
            return yield tx.withdrawalRequest.create({
                data: Object.assign(Object.assign({}, payload), { status: client_1.EStatusOfWithdrawalRequest.pending, dollarRate: config_1.default.dollarRate }),
            });
        }));
        (0, GenericEmailTemplates_1.default)({
            subject: 'Withdrawal Request Submitted',
            title: `Hey ${isUserExist.name}`,
            email: isUserExist.email,
            description: 'We have received your withdrawal request. It is currently being processed and will be completed soon.',
        });
        // make a transaction for auto withdraw
        // if (newWithdrawalRequest.bankName && newWithdrawalRequest.accountNumber) {
        //   await initiateWithdrawal({
        //     tx: newWithdrawalRequest.id,
        //     account_bank: newWithdrawalRequest.bankName,
        //     account_number: newWithdrawalRequest.accountNumber,
        //     amount: payload.amount,
        //     narration: 'Auto withdrawal transaction',
        //   });
        // }
        return newWithdrawalRequest;
    }
});
const getSingleWithdrawalRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.withdrawalRequest.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const getSingleUserWithdrawalRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.withdrawalRequest.findMany({
        where: {
            ownById: id,
        },
    });
    return result;
});
const updateWithdrawalRequest = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isWithdrawalRequestExits = yield prisma_1.default.withdrawalRequest.findFirst({
        where: { id },
        include: { ownBy: { select: { email: true, name: true } } },
    });
    if (!isWithdrawalRequestExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not found!');
    }
    //  check is it already updated to status approved
    if (isWithdrawalRequestExits.status === client_1.EStatusOfWithdrawalRequest.approved) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Approved request can't be update");
    }
    //  check is it already updated to status denied
    if (isWithdrawalRequestExits.status === client_1.EStatusOfWithdrawalRequest.denied) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "status is Denied  can't be update");
    }
    // now current status is pending
    // if update to approved
    if (payload.status === client_1.EStatusOfWithdrawalRequest.approved) {
        // now update admin currency only and withdrawal request to updated'
        const output = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // const amountToWithDraw = isWithdrawalRequestExits.amount;
            const isAdminExits = yield tx.user.findFirst({
                where: { email: config_1.default.mainAdminEmail },
                include: { Currency: true },
            });
            if (!isAdminExits || !isAdminExits.Currency) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Admin not found or admin currency not found');
            }
            // give few percentage to admin
            const amountToWithDraw = isWithdrawalRequestExits.amount;
            const adminFee = (config_1.default.withdrawalPercentage / 100) * amountToWithDraw;
            const roundedAdminFee = (0, lodash_1.round)(adminFee, config_1.default.calculationMoneyRound);
            // give money to admin
            yield tx.currency.update({
                where: { ownById: isAdminExits.id },
                data: {
                    amount: {
                        increment: roundedAdminFee,
                    },
                },
            });
            return yield tx.withdrawalRequest.update({
                where: {
                    id,
                },
                data: payload,
            });
        }));
        (0, GenericEmailTemplates_1.default)({
            subject: 'Your Withdrawal Was Successful',
            title: `Hey ${isWithdrawalRequestExits.ownBy.name}`,
            email: isWithdrawalRequestExits.ownBy.email,
            description: 'Your withdrawal request has been successfully processed. The funds should appear in your account shortly.',
        });
        return output;
    }
    else if (payload.status === client_1.EStatusOfWithdrawalRequest.denied) {
        // if update to denied
        // get back money
        return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const isUserCurrencyExist = yield tx.currency.findFirst({
                where: { ownById: isWithdrawalRequestExits.ownById },
            });
            if (!isUserCurrencyExist) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User currency not found!');
            }
            // update user money
            yield tx.currency.update({
                where: { ownById: isUserCurrencyExist.ownById },
                data: {
                    amount: {
                        increment: (0, calculation_1.incrementByPercentage)(isWithdrawalRequestExits.amount, config_1.default.withdrawalPercentage),
                    },
                },
            });
            return yield tx.withdrawalRequest.update({
                where: {
                    id,
                },
                data: payload,
            });
        }));
    }
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Only status with message can able to update ');
});
const deleteWithdrawalRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // please get back the money you have cut on when creating
    const isWithdrawalRequestExits = yield prisma_1.default.withdrawalRequest.findUnique({
        where: { id },
    });
    if (!isWithdrawalRequestExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not found!');
    }
    // if status is pending than return money
    if (isWithdrawalRequestExits.status === client_1.EStatusOfWithdrawalRequest.pending) {
        return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const isUserCurrencyExist = yield tx.currency.findFirst({
                where: { ownById: isWithdrawalRequestExits.ownById },
            });
            if (!isUserCurrencyExist) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User currency not found!');
            }
            // update user money
            yield tx.currency.update({
                where: { ownById: isUserCurrencyExist.ownById },
                data: { amount: { increment: isWithdrawalRequestExits.amount } },
            });
            return yield tx.withdrawalRequest.delete({
                where: { id },
            });
        }));
    }
    const result = yield prisma_1.default.withdrawalRequest.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'WithdrawalRequest not found!');
    }
    return result;
});
const getWithdrawalBank = () => __awaiter(void 0, void 0, void 0, function* () {
    // const response = await axios.get('https://api.paystack.co/bank');
    // return response.data;
    const data = yield (0, withdrawalRequest_utils_1.fetchBankCodes)();
    // console.log(data);
    return data;
});
exports.WithdrawalRequestService = {
    getAllWithdrawalRequest,
    createWithdrawalRequest,
    updateWithdrawalRequest,
    getSingleWithdrawalRequest,
    deleteWithdrawalRequest,
    getSingleUserWithdrawalRequest,
    getWithdrawalBank,
};
