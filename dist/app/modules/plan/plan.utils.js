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
exports.getAccountsUploadedToday = void 0;
const date_fns_1 = require("date-fns");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
function calculateDaysLeft(createdAt, days) {
    const expirationDate = (0, date_fns_1.endOfDay)((0, date_fns_1.addDays)(createdAt, days - 1)); // Calculate the expiration date at the end of the last day
    const today = new Date(); // Get today's date
    // Calculate the difference in days
    const daysLeft = (0, date_fns_1.differenceInCalendarDays)(expirationDate, today);
    // Return daysLeft, ensuring it's not negative
    return Math.max(daysLeft, 0);
}
function getAccountsUploadedToday(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const todayStart = (0, date_fns_1.startOfDay)(new Date());
        const todayEnd = (0, date_fns_1.endOfDay)(new Date());
        const accountsUploadedToday = yield prisma_1.default.account.count({
            where: {
                ownById: id,
                createdAt: {
                    gte: todayStart,
                    lte: todayEnd,
                },
            },
        });
        return accountsUploadedToday;
    });
}
exports.getAccountsUploadedToday = getAccountsUploadedToday;
exports.default = calculateDaysLeft;
