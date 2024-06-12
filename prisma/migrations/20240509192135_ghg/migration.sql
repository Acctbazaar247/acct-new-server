/*
  Warnings:

  - Added the required column `updatedAt` to the `Kyc` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EStatusOfKyc" AS ENUM ('pending', 'approved', 'denied');

-- AlterTable
ALTER TABLE "Kyc" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "EStatusOfKyc" NOT NULL DEFAULT 'pending',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
