import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ManualCurrencyRequestController } from './manualCurrencyRequest.controller';
import { ManualCurrencyRequestValidation } from './manualCurrencyRequest.validation';
const router = express.Router();

router.get(
  '/',
  auth(
    UserRole.admin,
    UserRole.superAdmin,
    UserRole.user,
    UserRole.financeAdmin
  ),
  ManualCurrencyRequestController.getAllManualCurrencyRequest
);
router.get(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.financeAdmin),
  ManualCurrencyRequestController.getSingleManualCurrencyRequest
);

router.post(
  '/',
  auth(UserRole.user, UserRole.seller),
  validateRequest(ManualCurrencyRequestValidation.createValidation),
  ManualCurrencyRequestController.createManualCurrencyRequest
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.financeAdmin),
  validateRequest(ManualCurrencyRequestValidation.updateValidation),
  ManualCurrencyRequestController.updateManualCurrencyRequest
);
router.delete(
  '/:id',
  ManualCurrencyRequestController.deleteManualCurrencyRequest
);

export const ManualCurrencyRequestRoutes = router;
