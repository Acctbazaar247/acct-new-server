"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt: {
        secret: process.env.JWT_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        refresh_secret_signup: process.env.JWT_REFRESH_SECRET_SIGNUP,
        expires_in: process.env.JWT_EXPIRES_IN,
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    emailUserPass: process.env.EMAIL_USER_PASS,
    emailUser: process.env.EMAIL_USER,
    mainAdminEmail: process.env.MAIN_ADMIN_EMAIL,
    frontendUrl: process.env.FRONT_END_URL,
    sellerOneTimePayment: parseFloat(process.env.SELLER_ONE_TIME_PAYMENT),
    currencyPerDollar: parseFloat(process.env.CURRENCY_PER_DOLLAR),
    withdrawalPercentage: parseFloat(process.env.WITHDRAWAL_PERCENTAGE),
    withdrawalMinMoney: parseFloat(process.env.WITHDRAWAL_MIN_MONEY),
    withdrawalMaxMoney: parseFloat(process.env.WITHDRAWAL_MAX_MONEY),
    calculationMoneyRound: parseInt(process.env.CALCULATION_MONEY_ROUND),
    accountSellServiceCharge: parseFloat(process.env.ACCOUNT_SELL_SERVICE_CHARGE),
    accountSellPercentage: parseFloat(process.env.ACCOUNT_SELL_PERCENTAGE),
    dollarRate: parseFloat(process.env.DOLLAR_RATE),
    paystackPaymentApiKey: process.env.PAYSTACK_PAYMENT_API_KEY,
    nowPaymentApiKey: process.env.NOW_PAYMENT_API_KEY,
    nowPaymentInvoiceUrl: process.env.NOW_PAYMENT_INVOICE_URL,
    baseServerUrl: process.env.BASER_SERVER_URL,
    mainLogo: process.env.MAIN_LOGO,
    cloudName: process.env.CLOUD_NAME,
    cloudApiKey: process.env.CLOUD_API_KEY,
    cloudApiSecret: process.env.CLOUD_API_SECRET,
    flutterwave_public_key: process.env.FLUTTERWAVE_PUBLIC_KEY,
    defaultPlanLimit: parseInt(process.env.DEFAULT_PLAN_LIMIT),
    basicPlanLimit: parseInt(process.env.BASIC_PLAN_LIMIT),
    basicPlanPrice: parseFloat(process.env.BASIC_PLAN_PRICE),
    basicPlanDays: parseInt(process.env.PRO_PLAN_DAYS),
    proPlanPrice: parseFloat(process.env.PRO_PLAN_PRICE),
    proPlanLimit: parseInt(process.env.PRO_PLAN_LIMIT),
    proPlanDays: parseInt(process.env.PRO_PLAN_DAYS),
    proPlusPlanPrice: parseFloat(process.env.PRO_PLUS_PLAN_PRICE),
    proPlusPlanLimit: parseInt(process.env.PRO_PLUS_PLAN_LIMIT),
    proPlusPlanDays: parseInt(process.env.PRO_PLUS_PLAN_DAYS),
    referralAmount: parseInt(process.env.REFERRAL_AMOUNT),
    referralFirstPayAmount: parseInt(process.env.REFERRAL_FIRST_PAY_AMOUNT),
};
