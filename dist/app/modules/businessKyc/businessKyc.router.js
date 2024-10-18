"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessKycRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const businessKyc_controller_1 = require("./businessKyc.controller");
const businessKyc_validation_1 = require("./businessKyc.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin), businessKyc_controller_1.BusinessKycController.getAllBusinessKyc);
router.get('/single-user-business-kyc', (0, auth_1.default)(client_1.UserRole.seller), businessKyc_controller_1.BusinessKycController.getSingleBusinessKycOfUser);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.seller), businessKyc_controller_1.BusinessKycController.getSingleBusinessKyc);
router.post('/', (0, auth_1.default)(client_1.UserRole.seller), (0, validateRequest_1.default)(businessKyc_validation_1.KycValidation.createValidation), businessKyc_controller_1.BusinessKycController.createBusinessKyc);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.seller, client_1.UserRole.admin, client_1.UserRole.superAdmin), (0, validateRequest_1.default)(businessKyc_validation_1.KycValidation.updateValidation), businessKyc_controller_1.BusinessKycController.updateBusinessKyc);
router.delete('/:id', 
// auth(UserRole.admin, UserRole.superAdmin, UserRole.seller),
businessKyc_controller_1.BusinessKycController.deleteBusinessKyc);
exports.BusinessKycRoutes = router;
