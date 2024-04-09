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
exports.SeenMessageController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const currentTime_1 = __importDefault(require("../../../utils/currentTime"));
const seenMessage_constant_1 = require("./seenMessage.constant");
const seenMessage_service_1 = require("./seenMessage.service");
const createSeenMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const SeenMessageData = req.body;
    const user = req.user;
    const result = yield seenMessage_service_1.SeenMessageService.createSeenMessage(Object.assign(Object.assign({}, SeenMessageData), { seenById: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SeenMessage Created successfully!',
        data: result,
    });
}));
const getAllSeenMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, [
        'searchTerm',
        ...seenMessage_constant_1.seenMessageFilterAbleFields,
    ]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield seenMessage_service_1.SeenMessageService.getAllSeenMessage(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SeenMessage retrieved successfully !',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleSeenMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield seenMessage_service_1.SeenMessageService.getSingleSeenMessage(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SeenMessage retrieved  successfully!',
        data: result,
    });
}));
const updateSeenMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateAbleData = req.body;
    const user = req.user;
    const result = yield seenMessage_service_1.SeenMessageService.updateSeenMessage(Object.assign(Object.assign({}, updateAbleData), { seenById: user.userId, lastSeen: (0, currentTime_1.default)() }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SeenMessage Updated successfully!',
        data: result,
    });
}));
const deleteSeenMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield seenMessage_service_1.SeenMessageService.deleteSeenMessage(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SeenMessage deleted successfully!',
        data: result,
    });
}));
exports.SeenMessageController = {
    getAllSeenMessage,
    createSeenMessage,
    updateSeenMessage,
    getSingleSeenMessage,
    deleteSeenMessage,
};
