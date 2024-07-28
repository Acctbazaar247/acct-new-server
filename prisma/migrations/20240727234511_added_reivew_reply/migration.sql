-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_accountId_fkey";

-- CreateTable
CREATE TABLE "ReviewReply" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "reply" TEXT NOT NULL,

    CONSTRAINT "ReviewReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewReply_id_key" ON "ReviewReply"("id");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReply" ADD CONSTRAINT "ReviewReply_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReply" ADD CONSTRAINT "ReviewReply_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
