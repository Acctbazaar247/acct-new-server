"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const referral_controller_1 = require("./referral.controller");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.seller, client_1.UserRole.user), referral_controller_1.ReferralController.getAllReferral);
router.get('/:id', referral_controller_1.ReferralController.getSingleReferral);
// router.post(
//   '/',
//   validateRequest(ReferralValidation.createValidation),
//   ReferralController.createReferral
// );
// router.patch(
//   '/:id',
//   validateRequest(ReferralValidation.updateValidation),
//   ReferralController.updateReferral
// );
// router.delete('/:id', ReferralController.deleteReferral);
exports.ReferralRoutes = router;
