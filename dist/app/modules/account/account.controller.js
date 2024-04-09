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
exports.AccountController = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const getAccountCategoryToType_1 = require("../../../helpers/getAccountCategoryToType");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const account_constant_1 = require("./account.constant");
const account_service_1 = require("./account.service");
const createAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const AccountData = req.body;
    const user = req.user;
    let result = null;
    const accountType = (0, getAccountCategoryToType_1.accountCategoryToType)(AccountData.category);
    if (user.role === client_1.UserRole.admin || user.role === client_1.UserRole.superAdmin) {
        result = yield account_service_1.AccountService.createAccount(Object.assign(Object.assign({}, AccountData), { ownById: user.userId, approvedForSale: client_1.EApprovedForSale.approved, accountType }));
        // await sendEmailToEveryOne({
        //   accountName: result?.name || '',
        //   category: result?.category || '',
        //   description: result?.description || '',
        //   price: result?.price || 0,
        //   without: [config.mainAdminEmail as string],
        // });
    }
    else {
        result = yield account_service_1.AccountService.createAccount(Object.assign(Object.assign({}, AccountData), { ownById: user.userId, approvedForSale: client_1.EApprovedForSale.pending, accountType }));
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Account Created successfully!',
        data: result,
    });
}));
const createAccountMultiple = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const AccountDatas = req.body;
    const user = req.user;
    // const accountType = accountCategoryToType(AccountData.category);
    const withUserIdAndAccountType = AccountDatas.map(single => (Object.assign(Object.assign({}, single), { accountType: (0, getAccountCategoryToType_1.accountCategoryToType)(single.category), ownById: user.userId, approvedForSale: client_1.UserRole.seller === user.role
            ? client_1.EApprovedForSale.pending
            : client_1.EApprovedForSale.approved })));
    const result = yield account_service_1.AccountService.createAccountMultiple(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    withUserIdAndAccountType);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Account Created successfully!',
        data: result,
    });
}));
const getAllAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...account_constant_1.accountFilterAbleFields,
        ...account_constant_1.accountFilterByPrice,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield account_service_1.AccountService.getAllAccount(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Account retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield account_service_1.AccountService.getSingleAccount(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Account retrieved  successfully!',
        data: result,
    });
}));
const updateAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const user = req.user;
    const result = yield account_service_1.AccountService.updateAccount(id, updateAbleData, {
        id: user.userId,
        role: user.role,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Account Updated successfully!',
        data: result,
    });
}));
const deleteAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield account_service_1.AccountService.deleteAccount(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Account deleted successfully!',
        data: result,
    });
}));
exports.AccountController = {
    getAllAccount,
    createAccount,
    updateAccount,
    getSingleAccount,
    deleteAccount,
    createAccountMultiple,
};
