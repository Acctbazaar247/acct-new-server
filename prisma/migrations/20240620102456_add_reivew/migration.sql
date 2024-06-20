-- CreateEnum
CREATE TYPE "EReviewStatus" AS ENUM ('positive', 'negative');

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "reviewStatus" "EReviewStatus" NOT NULL,
    "reviewText" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_id_key" ON "Review"("id");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
