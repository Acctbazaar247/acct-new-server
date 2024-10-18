import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BusinessKycController } from './businessKyc.controller';
import { KycValidation } from './businessKyc.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  BusinessKycController.getAllBusinessKyc
);
router.get(
  '/single-user-business-kyc',
  auth(UserRole.seller),
  BusinessKycController.getSingleBusinessKycOfUser
);
router.get(
  '/:id',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.seller),
  BusinessKycController.getSingleBusinessKyc
);

router.post(
  '/',
  auth(UserRole.seller),
  validateRequest(KycValidation.createValidation),
  BusinessKycController.createBusinessKyc
);

router.patch(
  '/:id',
  auth(UserRole.seller, UserRole.admin, UserRole.superAdmin),
  validateRequest(KycValidation.updateValidation),
  BusinessKycController.updateBusinessKyc
);
router.delete(
  '/:id',
  // auth(UserRole.admin, UserRole.superAdmin, UserRole.seller),
  BusinessKycController.deleteBusinessKyc
);

export const BusinessKycRoutes = router;
