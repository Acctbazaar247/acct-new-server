/*
  Warnings:

  - You are about to drop the column `busniessWebsite` on the `BusinessKyc` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BusinessKyc" DROP COLUMN "busniessWebsite",
ADD COLUMN     "businessWebsite" TEXT;
