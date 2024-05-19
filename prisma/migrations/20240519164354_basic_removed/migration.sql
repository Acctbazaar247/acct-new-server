/*
  Warnings:

  - The values [basic] on the enum `EPlanType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EPlanType_new" AS ENUM ('pro', 'proPlus');
ALTER TABLE "Plan" ALTER COLUMN "planType" TYPE "EPlanType_new" USING ("planType"::text::"EPlanType_new");
ALTER TYPE "EPlanType" RENAME TO "EPlanType_old";
ALTER TYPE "EPlanType_new" RENAME TO "EPlanType";
DROP TYPE "EPlanType_old";
COMMIT;
