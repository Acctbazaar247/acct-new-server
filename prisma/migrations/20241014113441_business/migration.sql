-- CreateEnum
CREATE TYPE "EBusinessType" AS ENUM ('soleProprietorship', 'partnership', 'corporation', 'llc', 'others');

-- CreateTable
CREATE TABLE "BusinessKyc" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessRegistration" TEXT NOT NULL,
    "businessType" "EBusinessType" NOT NULL,
    "industry" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "busniessWebsite" TEXT,
    "primaryContactPerson" TEXT NOT NULL,
    "positionOrTitle" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "bankAccountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "taxIdentificationNumber" TEXT NOT NULL,
    "businessRegistrationDocument" TEXT NOT NULL,
    "CertificateOfIncorporation" TEXT NOT NULL,
    "proofOfAddress" TEXT NOT NULL,
    "financialStatements" TEXT,
    "status" "EStatusOfKyc" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessKyc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "singleBeneficialOwners" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "businessKycId" TEXT NOT NULL,
    "ownershipPercentage" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "identificationDocument" TEXT NOT NULL,

    CONSTRAINT "singleBeneficialOwners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessKyc_id_key" ON "BusinessKyc"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessKyc_ownById_key" ON "BusinessKyc"("ownById");

-- CreateIndex
CREATE UNIQUE INDEX "singleBeneficialOwners_id_key" ON "singleBeneficialOwners"("id");

-- AddForeignKey
ALTER TABLE "BusinessKyc" ADD CONSTRAINT "BusinessKyc_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "singleBeneficialOwners" ADD CONSTRAINT "singleBeneficialOwners_businessKycId_fkey" FOREIGN KEY ("businessKycId") REFERENCES "BusinessKyc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
