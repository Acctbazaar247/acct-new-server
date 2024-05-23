import express from 'express';
import { ReferralController } from './referral.controller';
const router = express.Router();

router.get('/', ReferralController.getAllReferral);
router.get('/:id', ReferralController.getSingleReferral);

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

export const ReferralRoutes = router;
