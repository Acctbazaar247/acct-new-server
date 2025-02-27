"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Beneficial owner schema
const singleBeneficialOwnersSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1),
    ownershipPercentage: zod_1.z.string(),
    address: zod_1.z.string().min(1),
    dateOfBirth: zod_1.z.string(),
    identificationDocument: zod_1.z.string().min(1), // Assuming it's a file name or link
});
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        businessName: zod_1.z.string().min(1),
        businessRegistration: zod_1.z.string().min(1),
        businessType: zod_1.z.enum(Object.keys(client_1.EBusinessType)),
        industry: zod_1.z.string().min(1),
        businessAddress: zod_1.z.string().min(1),
        businessWebsite: zod_1.z.string().optional(),
        // Contact details
        primaryContactPerson: zod_1.z.string().min(1),
        positionOrTitle: zod_1.z.string().min(1),
        emailAddress: zod_1.z.string().email(),
        phoneNumber: zod_1.z.string().min(1), // Optionally more specific regex for phone validation
        // Ownership info
        beneficialOwner: zod_1.z.array(singleBeneficialOwnersSchema),
        // Financial information
        bankAccountNumber: zod_1.z.string().min(1),
        bankName: zod_1.z.string().min(1),
        taxIdentificationNumber: zod_1.z.string().min(1),
        // Documents
        businessRegistrationDocument: zod_1.z.string().min(1),
        CertificateOfIncorporation: zod_1.z.string().min(1),
        proofOfAddress: zod_1.z.string().min(1),
        financialStatements: zod_1.z.string().optional().nullable(),
        // // Status and timestamps
        // status: z
        //   .enum(Object.keys(EStatusOfKyc) as [string, ...string[]])
        //   .default('pending'),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        businessName: zod_1.z.string().min(1).optional(),
        businessRegistration: zod_1.z.string().min(1).optional(),
        businessType: zod_1.z
            .enum(Object.keys(client_1.EBusinessType))
            .optional(),
        industry: zod_1.z.string().min(1).optional(),
        businessAddress: zod_1.z.string().min(1).optional(),
        businessWebsite: zod_1.z.string().optional().optional(),
        // Contact details
        primaryContactPerson: zod_1.z.string().min(1).optional(),
        positionOrTitle: zod_1.z.string().min(1).optional(),
        emailAddress: zod_1.z.string().email().optional(),
        phoneNumber: zod_1.z.string().min(1).optional(), // Optionally more specific regex for phone validation
        // Ownership info
        beneficialOwner: zod_1.z.array(singleBeneficialOwnersSchema).optional(),
        // Financial information
        bankAccountNumber: zod_1.z.string().min(1).optional(),
        bankName: zod_1.z.string().min(1).optional(),
        taxIdentificationNumber: zod_1.z.string().min(1).optional(),
        // Documents
        businessRegistrationDocument: zod_1.z.string().min(1).optional(),
        CertificateOfIncorporation: zod_1.z.string().min(1).optional(),
        proofOfAddress: zod_1.z.string().min(1).optional(),
        financialStatements: zod_1.z.string().optional().nullable(),
        // Status and timestamps
    }),
});
exports.KycValidation = {
    createValidation,
    updateValidation,
};
