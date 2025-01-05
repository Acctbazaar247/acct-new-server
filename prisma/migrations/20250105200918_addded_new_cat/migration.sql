-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "accountCategory" ADD VALUE 'Noplace';
ALTER TYPE "accountCategory" ADD VALUE 'TenTen';
ALTER TYPE "accountCategory" ADD VALUE 'BeReal';
ALTER TYPE "accountCategory" ADD VALUE 'Airchat';
ALTER TYPE "accountCategory" ADD VALUE 'YikYak';
ALTER TYPE "accountCategory" ADD VALUE 'SubstackNotes';
ALTER TYPE "accountCategory" ADD VALUE 'Coverstar';
ALTER TYPE "accountCategory" ADD VALUE 'Jagat';
ALTER TYPE "accountCategory" ADD VALUE 'Fizz';
ALTER TYPE "accountCategory" ADD VALUE 'Lemon8';
ALTER TYPE "accountCategory" ADD VALUE 'Lapse';
ALTER TYPE "accountCategory" ADD VALUE 'Shopee';
ALTER TYPE "accountCategory" ADD VALUE 'OZON';
ALTER TYPE "accountCategory" ADD VALUE 'RedBook';
ALTER TYPE "accountCategory" ADD VALUE 'OLX';
ALTER TYPE "accountCategory" ADD VALUE 'Vinted';
ALTER TYPE "accountCategory" ADD VALUE 'YoulaRu';
ALTER TYPE "accountCategory" ADD VALUE 'JDcom';
ALTER TYPE "accountCategory" ADD VALUE 'Magicbricks';
ALTER TYPE "accountCategory" ADD VALUE 'Wish';
ALTER TYPE "accountCategory" ADD VALUE 'Bluesky';
ALTER TYPE "accountCategory" ADD VALUE 'QQ';
ALTER TYPE "accountCategory" ADD VALUE 'Kick';
ALTER TYPE "accountCategory" ADD VALUE 'Damus';
ALTER TYPE "accountCategory" ADD VALUE 'RTRO';
ALTER TYPE "accountCategory" ADD VALUE 'Gowalla';
ALTER TYPE "accountCategory" ADD VALUE 'Yandex';
ALTER TYPE "accountCategory" ADD VALUE 'Uber';
ALTER TYPE "accountCategory" ADD VALUE 'Grab';
ALTER TYPE "accountCategory" ADD VALUE 'Bolt';
ALTER TYPE "accountCategory" ADD VALUE 'BlaBlaCar';
ALTER TYPE "accountCategory" ADD VALUE 'inDriver';
ALTER TYPE "accountCategory" ADD VALUE 'Careem';
ALTER TYPE "accountCategory" ADD VALUE 'OnTaxi';
ALTER TYPE "accountCategory" ADD VALUE 'Gett';
