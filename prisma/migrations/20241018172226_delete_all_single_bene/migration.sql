-- DropForeignKey
ALTER TABLE "singleBeneficialOwners" DROP CONSTRAINT "singleBeneficialOwners_businessKycId_fkey";

-- AddForeignKey
ALTER TABLE "singleBeneficialOwners" ADD CONSTRAINT "singleBeneficialOwners_businessKycId_fkey" FOREIGN KEY ("businessKycId") REFERENCES "BusinessKyc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
