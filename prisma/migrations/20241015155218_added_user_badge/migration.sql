-- CreateEnum
CREATE TYPE "EBadge" AS ENUM ('blue', 'gold');

-- CreateEnum
CREATE TYPE "EStatusOfBusinessKyc" AS ENUM ('pending', 'approved', 'denied');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "badge" "EBadge" DEFAULT 'blue',
ADD COLUMN     "isBusinessVerified" BOOLEAN DEFAULT false;
