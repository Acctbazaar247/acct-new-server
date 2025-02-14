import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CurrencyRequestController } from './currencyRequest.controller';
import { CurrencyRequestValidation } from './currencyRequest.validation';
const router = express.Router();

router.get(
  '/',
  auth(
    UserRole.admin,
    UserRole.seller,
    UserRole.user,
    UserRole.superAdmin,
    UserRole.financeAdmin
  ),
  CurrencyRequestController.getAllCurrencyRequest
);
router.get(
  '/:id',
  auth(
    UserRole.admin,
    UserRole.seller,
    UserRole.user,
    UserRole.superAdmin,
    UserRole.financeAdmin
  ),
  CurrencyRequestController.getSingleCurrencyRequest
);

// router.post(
//   '/',
//   auth(UserRole.seller, UserRole.user),
//   validateRequest(CurrencyRequestValidation.createValidation),
//   CurrencyRequestController.createCurrencyRequest
// );
router.post(
  '/paystack',
  auth(UserRole.seller, UserRole.user),
  validateRequest(CurrencyRequestValidation.createValidation),
  CurrencyRequestController.createCurrencyRequestWithPayStack
);
// please the name is not match with the kora pay. it is useing kora pay
// router.post(
//   '/paystack',
//   auth(UserRole.seller, UserRole.user),
//   validateRequest(CurrencyRequestValidation.createValidation),
//   CurrencyRequestController.createCurrencyRequestWithKoraPay
// );
router.post(
  '/kora-pay',
  auth(UserRole.seller, UserRole.user),
  validateRequest(CurrencyRequestValidation.createValidation),
  CurrencyRequestController.createCurrencyRequestWithKoraPay
);
router.post(
  '/',
  auth(UserRole.seller, UserRole.user),
  validateRequest(CurrencyRequestValidation.createValidation),
  CurrencyRequestController.createCurrencyRequestInvoice
);
router.post(
  '/ox-process',
  auth(UserRole.seller, UserRole.user),
  validateRequest(CurrencyRequestValidation.createValidation),
  CurrencyRequestController.createCurrencyRequestWithOX
);

router.post('/webhook', CurrencyRequestController.payStackWebHook);
router.post('/kora-pay-webhook', CurrencyRequestController.koraPayWebHook);
router.post('/ox-process-webhook', CurrencyRequestController.OxWebHook);
router.post(
  '/nowpayments-ipn',
  CurrencyRequestController.getSingleCurrencyRequestIpn
);

router.patch(
  '/:id',
  auth(UserRole.superAdmin, UserRole.financeAdmin),
  validateRequest(CurrencyRequestValidation.updateValidation),
  CurrencyRequestController.updateCurrencyRequest
);
router.delete(
  '/:id',
  auth(UserRole.superAdmin, UserRole.financeAdmin),
  CurrencyRequestController.deleteCurrencyRequest
);

export const CurrencyRequestRoutes = router;
