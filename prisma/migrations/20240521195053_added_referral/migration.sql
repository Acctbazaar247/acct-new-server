-- CreateEnum
CREATE TYPE "EReferralStatus" AS ENUM ('pending', 'completed', 'cancel');

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "referralById" TEXT NOT NULL,
    "status" "EReferralStatus" NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Referral_id_key" ON "Referral"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_ownById_key" ON "Referral"("ownById");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referralById_fkey" FOREIGN KEY ("referralById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
