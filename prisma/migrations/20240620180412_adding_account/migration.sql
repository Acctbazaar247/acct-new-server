/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "accountId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_accountId_key" ON "Review"("accountId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
