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
exports.MessageService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const sendNotification_1 = __importDefault(require("../../../helpers/sendNotification"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const currentTime_1 = __importDefault(require("../../../utils/currentTime"));
const message_constant_1 = require("./message.constant");
const getAllMessage = (filters, paginationOptions, orderId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    // const chatGroupId= filterData.chatGroupId;
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = message_constant_1.messageSearchableFields.map(single => {
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
    let result = yield prisma_1.default.message.findMany({
        where: whereConditions,
        skip,
        // take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                createdAt: 'asc',
            },
        include: {
            sendBy: {
                select: {
                    email: true,
                    id: true,
                    name: true,
                    profileImg: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.message.count();
    const isSeenMessageExits = yield prisma_1.default.seenMessage.findFirst({
        where: { seenById: userId, orderId: orderId },
    });
    let unSeenCount = 0;
    if (isSeenMessageExits) {
        result = result.map(single => {
            const isSeen = new Date(isSeenMessageExits.lastSeen) >= new Date(single.createdAt);
            if (!isSeen) {
                unSeenCount++;
            }
            return Object.assign(Object.assign({}, single), { isSeen });
        });
    }
    const output = {
        data: result,
        meta: { page, limit, total, unSeenCount },
    };
    return output;
});
const createMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isOrderExits = yield prisma_1.default.orders.findUnique({
        where: { id: payload.orderId },
        select: {
            id: true,
            orderById: true,
            orderBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            account: {
                select: {
                    ownById: true,
                    name: true,
                    ownBy: {
                        select: {
                            name: true,
                            email: true,
                            id: true,
                        },
                    },
                },
            },
        },
    });
    if (!isOrderExits) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'order is not found');
    }
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { id: payload.sendById },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    //
    const newMessage = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const isSeenMessageExits = yield tx.seenMessage.findFirst({
            where: {
                orderId: payload.orderId,
                seenById: payload.sendById,
            },
        });
        if (!isSeenMessageExits) {
            yield tx.seenMessage.create({
                data: {
                    orderId: payload.orderId,
                    seenById: payload.sendById,
                    lastSeen: (0, currentTime_1.default)(),
                },
            });
        }
        else {
            yield tx.seenMessage.updateMany({
                where: {
                    orderId: payload.orderId,
                    seenById: payload.sendById,
                },
                data: { lastSeen: (0, currentTime_1.default)() },
            });
        }
        return yield tx.message.create({
            data: payload,
            include: {
                sendBy: {
                    select: {
                        email: true,
                        id: true,
                        name: true,
                        profileImg: true,
                    },
                },
            },
        });
    }));
    const ownById = payload.sendById === isOrderExits.orderById
        ? isOrderExits.account.ownById
        : isOrderExits.orderById;
    yield (0, sendNotification_1.default)({
        title: 'New Message',
        message: `You have a new message from ${isUserExist.name}`,
        ownById,
        link: `/order-details/${isOrderExits.id}`,
    });
    const senderInfo = payload.sendById === isOrderExits.orderById
        ? isOrderExits.orderBy
        : isOrderExits.account.ownBy;
    const recInfo = payload.sendById !== isOrderExits.orderById
        ? isOrderExits.orderBy
        : isOrderExits.account.ownBy;
    // sent email
    (0, sendEmail_1.default)({ to: recInfo.email }, {
        html: EmailTemplates_1.default.sendAMessage.html({
            from: senderInfo.name,
            productName: isOrderExits.account.name,
        }),
        subject: EmailTemplates_1.default.sendAMessage.subject,
    });
    return newMessage;
});
const getSingleMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.message.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateMessage = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.message.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.message.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Message not found!');
    }
    return result;
});
exports.MessageService = {
    getAllMessage,
    createMessage,
    updateMessage,
    getSingleMessage,
    deleteMessage,
};
