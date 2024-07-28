"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const kyc_controller_1 = require("./kyc.controller");
const kyc_validation_1 = require("./kyc.validation");
const router = express_1.default.Router();
router.get('/', 
// auth(UserRole.admin, UserRole.superAdmin),
kyc_controller_1.KycController.getAllKyc);
router.get('/single-user-kyc', (0, auth_1.default)(client_1.UserRole.seller), kyc_controller_1.KycController.getSingleKycOfUser);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.seller), kyc_controller_1.KycController.getSingleKyc);
router.post('/', (0, auth_1.default)(client_1.UserRole.seller), (0, validateRequest_1.default)(kyc_validation_1.KycValidation.createValidation), kyc_controller_1.KycController.createKyc);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.seller, client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(kyc_validation_1.KycValidation.updateValidation), kyc_controller_1.KycController.updateKyc);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.seller), kyc_controller_1.KycController.deleteKyc);
exports.KycRoutes = router;
