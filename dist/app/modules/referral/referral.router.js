"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralRoutes = void 0;
const express_1 = __importDefault(require("express"));
const referral_controller_1 = require("./referral.controller");
const router = express_1.default.Router();
router.get('/', referral_controller_1.ReferralController.getAllReferral);
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
