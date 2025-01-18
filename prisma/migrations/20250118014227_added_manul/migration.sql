-- CreateEnum
CREATE TYPE "EStatusOfManualCurrencyRequest" AS ENUM ('pending', 'approved', 'denied');

-- CreateTable
CREATE TABLE "ManualCurrencyRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "image" TEXT,
    "requestedAmount" DOUBLE PRECISION NOT NULL,
    "receivedAmount" DOUBLE PRECISION NOT NULL,
    "ownById" TEXT NOT NULL,
    "status" "EStatusOfManualCurrencyRequest" NOT NULL DEFAULT 'pending',
    "accountName" TEXT,
    "accountNumber" TEXT,
    "bankName" TEXT,
    "walletAddress" TEXT,
    "dollarRate" DOUBLE PRECISION,
    "isTrc" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManualCurrencyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManualCurrencyRequest_id_key" ON "ManualCurrencyRequest"("id");

-- AddForeignKey
ALTER TABLE "ManualCurrencyRequest" ADD CONSTRAINT "ManualCurrencyRequest_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
