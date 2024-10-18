import { EBusinessType } from '@prisma/client';
import { z } from 'zod';
const EStatusOfKyc = z.enum(['pending', 'approved', 'denied']);

// Beneficial owner schema
const singleBeneficialOwnersSchema = z.object({
  fullName: z.string().min(1),
  ownershipPercentage: z
    .string()
    .regex(/^\d{1,3}%$/, 'Ownership percentage should be between 0% and 100%'),
  address: z.string().min(1),
  dateOfBirth: z.date(),
  identificationDocument: z.string().min(1), // Assuming it's a file name or link
});
const createValidation = z.object({
  body: z.object({
    businessName: z.string().min(1),
    businessRegistration: z.string().min(1),
    businessType: z.enum(Object.keys(EBusinessType) as [string, ...string[]]),
    industry: z.string().min(1),
    businessAddress: z.string().min(1),
    businessWebsite: z.string().optional(),

    // Contact details
    primaryContactPerson: z.string().min(1),
    positionOrTitle: z.string().min(1),
    emailAddress: z.string().email(),
    phoneNumber: z.string().min(1), // Optionally more specific regex for phone validation

    // Ownership info
    beneficialOwner: z.array(singleBeneficialOwnersSchema),

    // Financial information
    bankAccountNumber: z.string().min(1),
    bankName: z.string().min(1),
    taxIdentificationNumber: z.string().min(1),

    // Documents
    businessRegistrationDocument: z.string().min(1),
    CertificateOfIncorporation: z.string().min(1),
    proofOfAddress: z.string().min(1),
    financialStatements: z.string().optional().nullable(),

    // Status and timestamps
    status: z.enum(Object.keys(EStatusOfKyc) as [string, ...string[]]),
  }),
});
const updateValidation = z.object({
  body: z.object({
    businessName: z.string().min(1).optional(),
    businessRegistration: z.string().min(1).optional(),
    businessType: z
      .enum(Object.keys(EBusinessType) as [string, ...string[]])
      .optional(),
    industry: z.string().min(1).optional(),
    businessAddress: z.string().min(1).optional(),
    businessWebsite: z.string().optional().optional(),

    // Contact details
    primaryContactPerson: z.string().min(1).optional(),
    positionOrTitle: z.string().min(1).optional(),
    emailAddress: z.string().email().optional(),
    phoneNumber: z.string().min(1).optional(), // Optionally more specific regex for phone validation

    // Ownership info
    beneficialOwner: z.array(singleBeneficialOwnersSchema),

    // Financial information
    bankAccountNumber: z.string().min(1).optional(),
    bankName: z.string().min(1).optional(),
    taxIdentificationNumber: z.string().min(1).optional(),

    // Documents
    businessRegistrationDocument: z.string().min(1).optional(),
    CertificateOfIncorporation: z.string().min(1).optional(),
    proofOfAddress: z.string().min(1).optional(),
    financialStatements: z.string().optional().nullable(),

    // Status and timestamps
    status: z
      .enum(Object.keys(EStatusOfKyc) as [string, ...string[]])
      .optional(),
  }),
});
export const KycValidation = {
  createValidation,
  updateValidation,
};
