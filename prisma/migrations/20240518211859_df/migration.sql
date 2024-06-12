-- CreateEnum
CREATE TYPE "EPlanType" AS ENUM ('basic', 'pro', 'proPlus');

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "planType" "EPlanType" NOT NULL,
    "limit" INTEGER NOT NULL,
    "days" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_id_key" ON "Plan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_ownById_key" ON "Plan"("ownById");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
