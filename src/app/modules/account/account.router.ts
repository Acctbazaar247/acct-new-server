import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AccountController } from './account.controller';
import { AccountValidation } from './account.validation';
const router = express.Router();

router.get('/', AccountController.getAllAccount);
router.get('/:id', AccountController.getSingleAccount);

// router.post(
//   '/',
//   auth(UserRole.admin, UserRole.seller, UserRole.superAdmin),
//   validateRequest(AccountValidation.createValidation),
//   AccountController.createAccount
// );
router.post(
  '/multi-upload',
  auth(UserRole.admin, UserRole.seller, UserRole.superAdmin),
  validateRequest(AccountValidation.createValidationMulti),
  AccountController.createAccountMultiple
);

router.patch(
  '/:id',
  auth(UserRole.admin, UserRole.seller, UserRole.superAdmin),
  validateRequest(AccountValidation.updateValidation),
  AccountController.updateAccount
);
router.delete(
  '/:id',
  auth(UserRole.admin, UserRole.seller, UserRole.superAdmin),
  AccountController.deleteAccount
);

export const AccountRoutes = router;
