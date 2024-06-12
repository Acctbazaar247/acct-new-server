"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const plan_controller_1 = require("./plan.controller");
const plan_validation_1 = require("./plan.validation");
const router = express_1.default.Router();
router.get('/', plan_controller_1.PlanController.getAllPlan);
router.get('/get-my-plan', (0, auth_1.default)(client_1.UserRole.seller), plan_controller_1.PlanController.getActivePlan);
router.get('/get-how-many-upload-left', (0, auth_1.default)(client_1.UserRole.seller), plan_controller_1.PlanController.getHowManyUploadLeft);
router.get('/:id', plan_controller_1.PlanController.getSinglePlan);
router.post('/', (0, auth_1.default)(client_1.UserRole.seller), (0, validateRequest_1.default)(plan_validation_1.PlanValidation.createValidation), plan_controller_1.PlanController.createPlan);
// router.patch(
//   '/:id',
//   validateRequest(PlanValidation.updateValidation),
//   PlanController.updatePlan
// );
// router.delete('/:id', PlanController.deletePlan);
exports.PlanRoutes = router;
