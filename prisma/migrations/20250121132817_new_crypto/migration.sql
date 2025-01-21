/*
  Warnings:

  - You are about to drop the column `cryptoType` on the `CryptoBank` table. All the data in the column will be lost.
  - You are about to drop the column `isTrc` on the `CryptoBank` table. All the data in the column will be lost.
  - Added the required column `name` to the `CryptoBank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CryptoBank" DROP COLUMN "cryptoType",
DROP COLUMN "isTrc",
ADD COLUMN     "name" TEXT NOT NULL;
