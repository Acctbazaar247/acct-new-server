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
exports.CurrencyRequestService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const OxPaymentInvoice_1 = __importDefault(require("../../../helpers/OxPaymentInvoice"));
const UpdateCurrencyByRequestAfterPay_1 = __importDefault(require("../../../helpers/UpdateCurrencyByRequestAfterPay"));
const createFlutterWaveInvoice_1 = __importDefault(require("../../../helpers/createFlutterWaveInvoice"));
const createKoraPayCheckout_1 = require("../../../helpers/createKoraPayCheckout");
const creeateInvoice_1 = __importDefault(require("../../../helpers/creeateInvoice"));
const nowPaymentChecker_1 = __importDefault(require("../../../helpers/nowPaymentChecker"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const common_1 = require("../../../interfaces/common");
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const currencyRequest_constant_1 = require("./currencyRequest.constant");
const getAllCurrencyRequest = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    console.log(skip, limit);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = currencyRequest_constant_1.currencyRequestSearchableFields.map(single => {
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
    const result = yield prisma_1.default.currencyRequest.findMany({
        where: whereConditions,
        skip,
        take: limit || 12,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            ownBy: true,
        },
    });
    const total = yield prisma_1.default.currencyRequest.count({ where: whereConditions });
    const output = {
        data: result,
        meta: { page, limit, total },
    };
    return output;
});
const createCurrencyRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newCurrencyRequest = yield prisma_1.default.currencyRequest.create({
        data: payload,
        include: {
            ownBy: true,
        },
    });
    return newCurrencyRequest;
});
const createCurrencyRequestInvoice = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newCurrencyRequest = prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const { pay_currency_btc } = payload, others = __rest(payload, ["pay_currency_btc"]);
        const result = yield tx.currencyRequest.create({
            data: Object.assign(Object.assign({}, others), { message: 'auto', status: client_1.EStatusOfCurrencyRequest.pending }),
            include: {
                ownBy: true,
            },
        });
        if (!newCurrencyRequest) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Invoie');
        }
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const data = yield (0, creeateInvoice_1.default)({
            price_amount: result.amount,
            order_id: result.id,
            ipn_callback_url: '/currency-request/nowpayments-ipn',
            success_url: config_1.default.frontendUrl + 'account/wallet' || '',
            cancel_url: config_1.default.frontendUrl || '',
            // additionalInfo: 'its adidinlal ',
            pay_currency_btc: payload.pay_currency_btc,
        });
        return Object.assign(Object.assign({}, result), { url: data.invoice_url });
    }));
    return newCurrencyRequest;
});
const createCurrencyRequestWithOX = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newCurrencyRequest = prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const { pay_currency_btc, currency } = payload, others = __rest(payload, ["pay_currency_btc", "currency"]);
        const result = yield tx.currencyRequest.create({
            data: Object.assign(Object.assign({}, others), { message: 'auto', status: client_1.EStatusOfCurrencyRequest.pending }),
            include: {
                ownBy: true,
            },
        });
        if (!newCurrencyRequest) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Invoie');
        }
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        const dataUrl = yield (0, OxPaymentInvoice_1.default)({
            amountUsd: result.amount,
            email: result.ownBy.email,
            clientId: result.id,
            billingId: result.id,
            currency: currency,
            paymentType: common_1.EPaymentType.addFunds,
            redirectUrl: config_1.default.frontendUrl + 'account/wallet' || '',
        });
        return Object.assign(Object.assign({}, result), { url: dataUrl });
    }));
    return newCurrencyRequest;
});
const createCurrencyRequestWithPayStack = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newCurrencyRequest = prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield tx.currencyRequest.create({
            data: Object.assign(Object.assign({}, payload), { message: 'auto', status: client_1.EStatusOfCurrencyRequest.pending }),
            include: {
                ownBy: true,
            },
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Invoie');
        }
        // const request = await initiatePayment(
        //   result.amount,
        //   result.ownBy.email,
        //   result.id,
        //   EPaymentType.addFunds,
        //   result.id,
        //   config.frontendUrl + 'account/wallet'
        // );
        const fluterWave = yield (0, createFlutterWaveInvoice_1.default)({
            amount: result.amount,
            customer_email: result.ownBy.email,
            redirect_url: config_1.default.frontendUrl + 'account/wallet',
            tx_ref: result.id,
            paymentType: common_1.EPaymentType.addFunds,
        });
        console.log({ fluterWave });
        // return { ...result, url: request.data.authorization_url || '' };
        return Object.assign(Object.assign({}, result), { url: fluterWave });
    }));
    return newCurrencyRequest;
});
const createCurrencyRequestWithKoraPay = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newCurrencyRequest = prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield tx.currencyRequest.create({
            data: Object.assign(Object.assign({}, payload), { message: 'auto', status: client_1.EStatusOfCurrencyRequest.pending }),
            include: {
                ownBy: true,
            },
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Invoie');
        }
        const koraPay = yield (0, createKoraPayCheckout_1.createKoraPayCheckout)({
            amount: result.amount,
            currency: 'NGN',
            customerName: result.ownBy.name,
            customerEmail: result.ownBy.email,
            reference: `${common_1.EPaymentType.addFunds}__${result.id}`,
            callbackUrl: config_1.default.frontendUrl + 'account/wallet',
        });
        console.log({ koraPay });
        // return { ...result, url: request.data.authorization_url || '' };
        return Object.assign(Object.assign({}, result), { url: koraPay.checkoutUrl });
    }));
    return newCurrencyRequest;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OxWebHook = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data, 'from Ox');
    const order_id = data.BillingID.split('_$_')[1];
    console.log({ order_id });
    const payment_status = 'finished';
    const isCurrencyRequestExits = yield prisma_1.default.currencyRequest.findUnique({
        where: { id: order_id },
    });
    if (!isCurrencyRequestExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'currency request not found!');
    }
    // change status of currency Request and add money to user
    yield (0, UpdateCurrencyByRequestAfterPay_1.default)({
        order_id,
        payment_status,
        price_amount: isCurrencyRequestExits.amount,
    });
    // const result = await prisma.currencyRequest.findUnique({
    //   where: {
    //     id,
    //   },
    // });
    // return result;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const payStackWebHook = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data, 'from flutter wave');
    const order_id = data.data.data.tx_ref.split('_$_')[1];
    console.log({ order_id });
    const payment_status = 'finished';
    const isCurrencyRequestExits = yield prisma_1.default.currencyRequest.findUnique({
        where: { id: order_id },
    });
    if (!isCurrencyRequestExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'currency request not found!');
    }
    // change status of currency Request and add money to user
    yield (0, UpdateCurrencyByRequestAfterPay_1.default)({
        order_id,
        payment_status,
        price_amount: isCurrencyRequestExits.amount,
    });
    // const result = await prisma.currencyRequest.findUnique({
    //   where: {
    //     id,
    //   },
    // });
    // return result;
});
const koraPayWebHook = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data, 'from Kora pay wave');
    const order_id = data.data.reference.split('__')[1];
    console.log({ order_id });
    const payment_status = 'finished';
    const isCurrencyRequestExits = yield prisma_1.default.currencyRequest.findUnique({
        where: { id: order_id },
    });
    if (!isCurrencyRequestExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'currency request not found!');
    }
    // change status of currency Request and add money to user
    yield (0, UpdateCurrencyByRequestAfterPay_1.default)({
        order_id,
        payment_status,
        price_amount: isCurrencyRequestExits.amount,
    });
    // const result = await prisma.currencyRequest.findUnique({
    //   where: {
    //     id,
    //   },
    // });
    // return result;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCurrencyRequestIpn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id, payment_status, price_amount } = data;
    if (data.payment_status !== 'finished') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Sorry payment is not finished yet ');
    }
    yield (0, nowPaymentChecker_1.default)(data.payment_id);
    yield (0, UpdateCurrencyByRequestAfterPay_1.default)({
        order_id,
        payment_status,
        price_amount,
    });
    // change status of currency Request and add money to user
    // const result = await prisma.currencyRequest.findUnique({
    //   where: {
    //     id,
    //   },
    // });
    // return result;
});
const getSingleCurrencyRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.currencyRequest.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateCurrencyRequest = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is already status is approved?
    const queryData = yield prisma_1.default.currencyRequest.findFirst({ where: { id } });
    if (!queryData) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Data not found!');
    }
    if (queryData.status === client_1.EStatusOfCurrencyRequest.approved) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already approved!');
    }
    if (payload.status === client_1.EStatusOfCurrencyRequest.approved) {
        // start updating
        const updatedCurrencyRequest = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield tx.currencyRequest.update({
                where: {
                    id,
                },
                data: payload,
            });
            // get previous currency
            const previousCurrency = yield tx.currency.findFirst({
                where: { ownById: result.ownById },
            });
            if (!previousCurrency) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User currency not found');
            }
            // update currency
            const newAddedAmount = result.amount * config_1.default.currencyPerDollar;
            const newAmount = previousCurrency.amount + newAddedAmount;
            // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
            const updateCurrency = yield tx.currency.update({
                where: { ownById: result.ownById },
                data: { amount: newAmount },
            });
            const queryUser = yield prisma_1.default.user.findUnique({
                where: { id: queryData.ownById },
            });
            if (!queryUser) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
            }
            yield (0, sendEmail_1.default)({ to: queryUser === null || queryUser === void 0 ? void 0 : queryUser.email }, {
                subject: EmailTemplates_1.default.confirmEmailForCurrencyPurchase.subject,
                html: EmailTemplates_1.default.confirmEmailForCurrencyPurchase.html({
                    currencyAmount: newAddedAmount,
                    currentAmount: newAmount,
                }),
            });
            return result;
        }));
        return updatedCurrencyRequest;
    }
    else {
        const result = yield prisma_1.default.currencyRequest.update({
            where: {
                id,
            },
            data: payload,
        });
        return result;
    }
});
const deleteCurrencyRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.currencyRequest.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'CurrencyRequest not found!');
    }
    return result;
});
exports.CurrencyRequestService = {
    getAllCurrencyRequest,
    createCurrencyRequest,
    updateCurrencyRequest,
    getSingleCurrencyRequest,
    deleteCurrencyRequest,
    createCurrencyRequestInvoice,
    createCurrencyRequestIpn,
    createCurrencyRequestWithPayStack,
    payStackWebHook,
    createCurrencyRequestWithKoraPay,
    koraPayWebHook,
    createCurrencyRequestWithOX,
    OxWebHook,
};
