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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const EmailTemplates_1 = __importDefault(require("../../../shared/EmailTemplates"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = __rest(req.body, []);
    const output = yield auth_service_1.AuthService.createUser(data);
    const { refreshToken, otp } = output, result = __rest(output, ["refreshToken", "otp"]);
    yield (0, sendEmail_1.default)({ to: result.user.email }, {
        subject: EmailTemplates_1.default.verify.subject,
        html: EmailTemplates_1.default.verify.html({
            token: otp,
        }),
    });
    // if (output.user.role == UserRole.seller) {
    //   await sendEmail(
    //     { to: config.emailUser as string },
    //     {
    //       subject: EmailTemplates.sellerRequest.subject,
    //       html: EmailTemplates.sellerRequest.html({
    //         userEmail: output.user.email,
    //         txId: output.user.txId as string,
    //       }),
    //     }
    //   );
    // }
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user created successfully!',
        data: result,
    });
}));
const resendEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const output = yield auth_service_1.AuthService.resendEmail(email || '');
    const result = __rest(output, []);
    yield (0, sendEmail_1.default)({ to: email }, {
        subject: EmailTemplates_1.default.verify.subject,
        html: EmailTemplates_1.default.verify.html({ token: output === null || output === void 0 ? void 0 : output.otp }),
    });
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'email send successfully!',
        data: result,
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = req.body;
    const result = yield auth_service_1.AuthService.loginUser(loginInfo);
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User lohggedin successfully !',
        data: {
            accessToken: result.accessToken,
            user: result.user,
        },
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'New access token generated successfully !',
        data: result,
    });
}));
const verifySignupToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const user = req.user;
    if (!token) {
        new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Token not found');
    }
    const result = yield auth_service_1.AuthService.verifySignupToken(token, user.userId);
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Token verify successfully',
        data: result,
    });
}));
const verifyForgotToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.body;
    if (!token) {
        new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Token not found');
    }
    if (!email) {
        new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email not found');
    }
    const result = yield auth_service_1.AuthService.verifyForgotToken(token, email);
    // set refresh token
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Token verify successfully',
        data: result,
    });
}));
const sendWithdrawalTokenEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield auth_service_1.AuthService.sendWithdrawalTokenEmail(user.userId);
    // set refresh token
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Token  send successfully',
        data: result,
    });
}));
const sendForgotEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    yield auth_service_1.AuthService.sendForgotEmail(email || '');
    // set refresh token into cookie
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Opt send successfully',
        data: {
            otp: 'Opt send successfully',
        },
    });
}));
const becomeSeller = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { payWith, currency } = req.body;
    const output = yield auth_service_1.AuthService.becomeSeller(user.userId, payWith, currency);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'url successfully generate',
        data: output,
    });
}));
const becomeSellerWithWallet = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { payWith } = req.body;
    const output = yield auth_service_1.AuthService.becomeSellerWithWallet(user.userId, payWith);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'successfully become a seller',
        data: output,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const output = yield auth_service_1.AuthService.changePassword(data);
    const { refreshToken } = output, result = __rest(output, ["refreshToken"]);
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'password change successfully!',
        data: result,
    });
}));
const changeWithdrawPin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const user = req.user;
    const output = yield auth_service_1.AuthService.changeWithdrawPin(Object.assign(Object.assign({}, data), { id: user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'password change successfully!',
        data: output,
    });
}));
const addWithdrawalPasswordFirstTime = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const user = req.user;
    const output = yield auth_service_1.AuthService.addWithdrawalPasswordFirstTime({
        password: data.password,
        userId: user.userId,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'password change successfully!',
        data: output,
    });
}));
exports.AuthController = {
    createUser,
    loginUser,
    refreshToken,
    verifySignupToken,
    resendEmail,
    verifyForgotToken,
    changePassword,
    sendForgotEmail,
    becomeSeller,
    addWithdrawalPasswordFirstTime,
    sendWithdrawalTokenEmail,
    changeWithdrawPin,
    becomeSellerWithWallet,
};
