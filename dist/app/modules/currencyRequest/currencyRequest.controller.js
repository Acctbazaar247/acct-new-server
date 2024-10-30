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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyRequestController = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const UpdateSellerAfterPay_1 = __importDefault(require("../../../helpers/UpdateSellerAfterPay"));
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const common_1 = require("../../../interfaces/common");
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const catchAsyncSemaphore_1 = __importDefault(require("../../../shared/catchAsyncSemaphore"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const withdrawalRequest_service_1 = require("../withdrawalRequest/withdrawalRequest.service");
const currencyRequest_constant_1 = require("./currencyRequest.constant");
const currencyRequest_service_1 = require("./currencyRequest.service");
const createCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const CurrencyRequestData = req.body;
    const user = req.user;
    const userInfo = yield prisma_1.default.user.findFirst({
        where: { id: user.userId },
    });
    const result = yield currencyRequest_service_1.CurrencyRequestService.createCurrencyRequest(Object.assign(Object.assign({}, CurrencyRequestData), { ownById: user.userId }));
    yield (0, sendEmail_1.default)({ to: config_1.default.emailUser }, {
        subject: EmailTemplates_1.default.requestForCurrencyToAdmin.subject,
        html: EmailTemplates_1.default.requestForCurrencyToAdmin.html({
            amount: result === null || result === void 0 ? void 0 : result.amount,
            userEmail: userInfo === null || userInfo === void 0 ? void 0 : userInfo.email,
            userName: userInfo === null || userInfo === void 0 ? void 0 : userInfo.name,
            userProfileImg: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.profileImg) || '',
        }),
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest Created successfully!',
        data: result,
    });
}));
const createCurrencyRequestInvoice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const CurrencyRequestData = req.body;
    const user = req.user;
    // const userInfo = await prisma.user.findFirst({
    //   where: { id: user.userId },
    // });
    const result = yield currencyRequest_service_1.CurrencyRequestService.createCurrencyRequestInvoice(Object.assign(Object.assign({}, CurrencyRequestData), { ownById: user.userId }));
    // await sendEmail(
    //   { to: config.emailUser as string },
    //   {
    //     subject: EmailTemplates.requestForCurrencyToAdmin.subject,
    //     html: EmailTemplates.requestForCurrencyToAdmin.html({
    //       amount: result?.amount,
    //       userEmail: userInfo?.email,
    //       userName: userInfo?.name,
    //       userProfileImg: userInfo?.profileImg || '',
    //     }),
    //   }
    // );
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest Created successfully!',
        data: result,
    });
}));
const createCurrencyRequestWithPayStack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const CurrencyRequestData = req.body;
    const user = req.user;
    const result = yield currencyRequest_service_1.CurrencyRequestService.createCurrencyRequestWithPayStack(Object.assign(Object.assign({}, CurrencyRequestData), { ownById: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest Created successfully!',
        data: result,
    });
}));
const getAllCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...currencyRequest_constant_1.currencyRequestFilterAbleFields,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield currencyRequest_service_1.CurrencyRequestService.getAllCurrencyRequest(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const payStackWebHook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const secretHash = config_1.default.flutterwave_hash;
    const signature = req.headers['verif-hash'];
    if (!signature || signature !== secretHash) {
        // This request isn't from Flutterwave; discard
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Only allowed from flutterwave');
    }
    const ipnData = req.body;
    console.log({ ipnData }, 'webhook');
    if (ipnData.event === 'transfer.completed') {
        console.log('transfer.completed');
        if (ipnData.data.status === 'SUCCESSFUL' ||
            ipnData.data.status === 'successful') {
            console.log('withdraw completed');
            withdrawalRequest_service_1.WithdrawalRequestService.updateWithdrawalRequest(ipnData.data.reference, { status: client_1.EStatusOfWithdrawalRequest.approved });
        }
        else {
            console.log('withdraw failed');
            withdrawalRequest_service_1.WithdrawalRequestService.updateWithdrawalRequest(ipnData.data.reference, { status: client_1.EStatusOfWithdrawalRequest.denied });
        }
    }
    else if (ipnData.status === 'successful') {
        // const paymentReference = ipnData.data.reference;
        // Perform additional actions, such as updating your database, sending emails, etc.
        const paymentType = ipnData === null || ipnData === void 0 ? void 0 : ipnData.txRef.split('_$_')[0];
        if (paymentType === common_1.EPaymentType.addFunds) {
            yield currencyRequest_service_1.CurrencyRequestService.payStackWebHook({
                data: ipnData,
            });
        }
        else if (paymentType === common_1.EPaymentType.seller) {
            yield (0, UpdateSellerAfterPay_1.default)({
                order_id: ipnData === null || ipnData === void 0 ? void 0 : ipnData.txRef.split('_$_')[1],
                payment_status: 'finished',
                price_amount: config_1.default.sellerOneTimePayment,
            });
        }
    }
    // eslint-disable-next-line no-console
    console.log({ ipnData }, 'webhook');
    // eslint-disable-next-line no-unused-vars
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest retrieved  successfully!',
        data: 'success',
    });
}));
const getSingleCurrencyRequestIpn = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ipnData = req.body;
    // eslint-disable-next-line no-unused-vars
    yield currencyRequest_service_1.CurrencyRequestService.createCurrencyRequestIpn(ipnData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest retrieved  successfully!',
        data: 'succes',
    });
}));
const getSingleCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield currencyRequest_service_1.CurrencyRequestService.getSingleCurrencyRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest retrieved  successfully!',
        data: result,
    });
}));
const updateCurrencyRequest = (0, catchAsyncSemaphore_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield currencyRequest_service_1.CurrencyRequestService.updateCurrencyRequest(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest Updated successfully!',
        data: result,
    });
}));
const deleteCurrencyRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield currencyRequest_service_1.CurrencyRequestService.deleteCurrencyRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'CurrencyRequest deleted successfully!',
        data: result,
    });
}));
exports.CurrencyRequestController = {
    getAllCurrencyRequest,
    createCurrencyRequest,
    updateCurrencyRequest,
    getSingleCurrencyRequest,
    deleteCurrencyRequest,
    createCurrencyRequestInvoice,
    getSingleCurrencyRequestIpn,
    createCurrencyRequestWithPayStack,
    payStackWebHook,
};
