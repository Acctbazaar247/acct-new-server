"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_router_1 = require("../modules/account/account.router");
const auth_route_1 = require("../modules/auth/auth.route");
const bank_router_1 = require("../modules/bank/bank.router");
const businessKyc_router_1 = require("../modules/businessKyc/businessKyc.router");
const cart_router_1 = require("../modules/cart/cart.router");
const cryptoBank_router_1 = require("../modules/cryptoBank/cryptoBank.router");
const currency_router_1 = require("../modules/currency/currency.router");
const currencyRequest_router_1 = require("../modules/currencyRequest/currencyRequest.router");
const fileUpload_route_1 = require("../modules/fileUpload/fileUpload.route");
const kyc_router_1 = require("../modules/kyc/kyc.router");
const manualCurrencyRequest_router_1 = require("../modules/manualCurrencyRequest/manualCurrencyRequest.router");
const message_router_1 = require("../modules/message/message.router");
const notifications_router_1 = require("../modules/notifications/notifications.router");
const orders_router_1 = require("../modules/orders/orders.router");
const plan_router_1 = require("../modules/plan/plan.router");
const profile_router_1 = require("../modules/profile/profile.router");
const referral_router_1 = require("../modules/referral/referral.router");
const review_router_1 = require("../modules/review/review.router");
const seenMessage_router_1 = require("../modules/seenMessage/seenMessage.router");
const user_router_1 = require("../modules/user/user.router");
const withdrawalRequest_router_1 = require("../modules/withdrawalRequest/withdrawalRequest.router");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_router_1.UserRoutes,
    },
    {
        path: '/profile',
        route: profile_router_1.ProfileRoutes,
    },
    {
        path: '/accounts',
        route: account_router_1.AccountRoutes,
    },
    {
        path: '/order',
        route: orders_router_1.OrdersRoutes,
    },
    {
        path: '/cart',
        route: cart_router_1.CartRoutes,
    },
    {
        path: '/currency',
        route: currency_router_1.CurrencyRoutes,
    },
    {
        path: '/currency-request',
        route: currencyRequest_router_1.CurrencyRequestRoutes,
    },
    {
        path: '/withdrawal-request',
        route: withdrawalRequest_router_1.WithdrawalRequestRoutes,
    },
    {
        path: '/message',
        route: message_router_1.MessageRoutes,
    },
    {
        path: '/seen-message',
        route: seenMessage_router_1.SeenMessageRoutes,
    },
    {
        path: '/uploadImg',
        route: fileUpload_route_1.fileUploadRoutes,
    },
    {
        path: '/notification',
        route: notifications_router_1.NotificationsRoutes,
    },
    {
        path: '/kyc',
        route: kyc_router_1.KycRoutes,
    },
    {
        path: '/business-kyc',
        route: businessKyc_router_1.BusinessKycRoutes,
    },
    {
        path: '/referral',
        route: referral_router_1.ReferralRoutes,
    },
    {
        path: '/plan',
        route: plan_router_1.PlanRoutes,
    },
    {
        path: '/review',
        route: review_router_1.ReviewRoutes,
    },
    {
        path: '/bank',
        route: bank_router_1.BankRoutes,
    },
    {
        path: '/crypto-bank',
        route: cryptoBank_router_1.CryptoBankRoutes,
    },
    {
        path: '/manual-currency-request',
        route: manualCurrencyRequest_router_1.ManualCurrencyRequestRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
