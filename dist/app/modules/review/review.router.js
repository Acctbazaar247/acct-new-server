"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.prAdmin, client_1.UserRole.financeAdmin, client_1.UserRole.user, client_1.UserRole.seller, client_1.UserRole.ccAdmin), review_controller_1.ReviewController.getAllReview);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.prAdmin, client_1.UserRole.financeAdmin, client_1.UserRole.user, client_1.UserRole.seller, client_1.UserRole.ccAdmin), review_controller_1.ReviewController.getSingleReview);
router.post('/', (0, validateRequest_1.default)(review_validation_1.ReviewValidation.createValidation), (0, auth_1.default)(client_1.UserRole.seller, client_1.UserRole.user), review_controller_1.ReviewController.createReview);
router.post('/add-reply', (0, validateRequest_1.default)(review_validation_1.ReviewValidation.createReplyValidation), (0, auth_1.default)(client_1.UserRole.seller, client_1.UserRole.user), review_controller_1.ReviewController.createReviewReply);
// router.patch(
//   '/:id',
//   validateRequest(ReviewValidation.updateValidation),
//   ReviewController.updateReview
// );
router.delete('/:id', review_controller_1.ReviewController.deleteReview);
exports.ReviewRoutes = router;
