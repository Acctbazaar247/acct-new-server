"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const message_controller_1 = require("./message.controller");
const message_validation_1 = require("./message.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.user, client_1.UserRole.seller), message_controller_1.MessageController.getAllMessage);
router.get('/:id', message_controller_1.MessageController.getSingleMessage);
router.post('/', (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.superAdmin, client_1.UserRole.user, client_1.UserRole.seller), (0, validateRequest_1.default)(message_validation_1.MessageValidation.createValidation), message_controller_1.MessageController.createMessage);
router.patch('/:id', (0, validateRequest_1.default)(message_validation_1.MessageValidation.updateValidation), message_controller_1.MessageController.updateMessage);
router.delete('/:id', message_controller_1.MessageController.deleteMessage);
exports.MessageRoutes = router;
