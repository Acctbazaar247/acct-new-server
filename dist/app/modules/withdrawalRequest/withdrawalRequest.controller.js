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
exports.WithdrawalRequestController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const catchAsyncSemaphore_1 = __importDefault(require("../../../shared/catchAsyncSemaphore"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const withdrawalRequest_constant_1 = require("./withdrawalRequest.constant");
const withdrawalRequest_service_1 = require("./withdrawalRequest.service");
const createWithdrawalRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const WithdrawalRequestData = req.body;
    const user = req.user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data = {
        amount: WithdrawalRequestData.amount,
    };
    console.log(WithdrawalRequestData);
    if (WithdrawalRequestData.walletAddress &&
        WithdrawalRequestData.isTrc !== undefined) {
        data.walletAddress = WithdrawalRequestData.walletAddress;
        data.isTrc = WithdrawalRequestData.isTrc;
    }
    else if (WithdrawalRequestData.accountNumber &&
        WithdrawalRequestData.fullName &&
        WithdrawalRequestData.bankName) {
        data = {
            amount: WithdrawalRequestData.amount,
            fullName: WithdrawalRequestData.fullName,
            accountNumber: WithdrawalRequestData.accountNumber,
            bankName: WithdrawalRequestData.bankName,
        };
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Data didn't pass properly");
    }
    const result = yield withdrawalRequest_service_1.WithdrawalRequestService.createWithdrawalRequest(Object.assign(Object.assign({}, data), { ownById: user.userId }), user, WithdrawalRequestData.withdrawalPin);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'WithdrawalRequest Created successfully!',
        data: result,
    });
}));
const getAllWithdrawalRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...withdrawalRequest_constant_1.withdrawalRequestFilterAbleFields,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield withdrawalRequest_service_1.WithdrawalRequestService.getAllWithdrawalRequest(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'WithdrawalRequest retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleWithdrawalRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield withdrawalRequest_service_1.WithdrawalRequestService.getSingleWithdrawalRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'WithdrawalRequest retrieved  successfully!',
        data: result,
    });
}));
const getWithdrawalBank = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield withdrawalRequest_service_1.WithdrawalRequestService.getWithdrawalBank();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Withdrawal bank retrieved  successfully!',
        data: result,
    });
}));
const getSingleUserWithdrawalRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const id = user.userId;
    const result = yield withdrawalRequest_service_1.WithdrawalRequestService.getSingleUserWithdrawalRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'WithdrawalRequest retrieved  successfully!',
        data: result,
    });
}));
const updateWithdrawalRequest = (0, catchAsyncSemaphore_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const result = yield withdrawalRequest_service_1.WithdrawalRequestService.updateWithdrawalRequest(id, updateAbleData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'WithdrawalRequest Updated successfully!',
        data: result,
    });
}));
const deleteWithdrawalRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield withdrawalRequest_service_1.WithdrawalRequestService.deleteWithdrawalRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'WithdrawalRequest deleted successfully!',
        data: result,
    });
}));
exports.WithdrawalRequestController = {
    getAllWithdrawalRequest,
    createWithdrawalRequest,
    updateWithdrawalRequest,
    getSingleWithdrawalRequest,
    deleteWithdrawalRequest,
    getSingleUserWithdrawalRequest,
    getWithdrawalBank,
};
