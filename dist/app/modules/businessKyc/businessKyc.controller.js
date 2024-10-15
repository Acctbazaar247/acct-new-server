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
exports.BusinessKycController = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const businessKyc_constant_1 = require("./businessKyc.constant");
const businessKyc_service_1 = require("./businessKyc.service");
const createBusinessKyc = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const BusinessKycData = req.body;
    const user = req.user;
    const result = yield businessKyc_service_1.BusinessKycService.createBusinessKyc(Object.assign(Object.assign({}, BusinessKycData), { ownById: user.userId, status: client_1.EStatusOfKyc.pending }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Business BusinessKyc Created successfully!',
        data: result,
    });
}));
const getAllBusinessKyc = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...businessKyc_constant_1.businessKycFilterAbleFields,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield businessKyc_service_1.BusinessKycService.getAllBusinessKyc(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'BusinessKyc retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleBusinessKyc = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield businessKyc_service_1.BusinessKycService.getSingleBusinessKyc(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'BusinessKyc retrieved  successfully!',
        data: result,
    });
}));
const getSingleBusinessKycOfUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield businessKyc_service_1.BusinessKycService.getSingleBusinessKycOfUser(user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'BusinessKyc retrieved successfully!',
        data: result,
    });
}));
const updateBusinessKyc = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateAbleData = req.body;
    const user = req.user;
    const result = yield businessKyc_service_1.BusinessKycService.updateBusinessKyc(id, updateAbleData, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'BusinessKyc Updated successfully!',
        data: result,
    });
}));
const deleteBusinessKyc = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield businessKyc_service_1.BusinessKycService.deleteBusinessKyc(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'BusinessKyc deleted successfully!',
        data: result,
    });
}));
exports.BusinessKycController = {
    getAllBusinessKyc,
    createBusinessKyc,
    updateBusinessKyc,
    getSingleBusinessKyc,
    deleteBusinessKyc,
    getSingleBusinessKycOfUser,
};
