/*
  Warnings:

  - You are about to drop the column `isTrc` on the `ManualCurrencyRequest` table. All the data in the column will be lost.
  - You are about to drop the column `walletAddress` on the `ManualCurrencyRequest` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ECryptoType" AS ENUM ('USDT', 'USDC', 'BTC', 'SOLANA');

-- AlterTable
ALTER TABLE "ManualCurrencyRequest" DROP COLUMN "isTrc",
DROP COLUMN "walletAddress",
ADD COLUMN     "bankId" TEXT,
ADD COLUMN     "cryptoBankId" TEXT,
ADD COLUMN     "transactionHash" TEXT;

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoBank" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "cryptoType" "ECryptoType" NOT NULL,
    "isTrc" BOOLEAN,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CryptoBank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bank_id_key" ON "Bank"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoBank_id_key" ON "CryptoBank"("id");

-- AddForeignKey
ALTER TABLE "ManualCurrencyRequest" ADD CONSTRAINT "ManualCurrencyRequest_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualCurrencyRequest" ADD CONSTRAINT "ManualCurrencyRequest_cryptoBankId_fkey" FOREIGN KEY ("cryptoBankId") REFERENCES "CryptoBank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
