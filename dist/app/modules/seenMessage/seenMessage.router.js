"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeenMessageRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const seenMessage_controller_1 = require("./seenMessage.controller");
const seenMessage_validation_1 = require("./seenMessage.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.user, client_1.UserRole.seller), seenMessage_controller_1.SeenMessageController.getAllSeenMessage);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.user, client_1.UserRole.seller), seenMessage_controller_1.SeenMessageController.getSingleSeenMessage);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.seller, client_1.UserRole.user), (0, validateRequest_1.default)(seenMessage_validation_1.SeenMessageValidation.createValidation), seenMessage_controller_1.SeenMessageController.createSeenMessage);
router.patch('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.user, client_1.UserRole.seller), (0, validateRequest_1.default)(seenMessage_validation_1.SeenMessageValidation.updateValidation), seenMessage_controller_1.SeenMessageController.updateSeenMessage);
router.delete('/:id', seenMessage_controller_1.SeenMessageController.deleteSeenMessage);
exports.SeenMessageRoutes = router;
