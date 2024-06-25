-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "accountCategory" ADD VALUE 'Grindr';
ALTER TYPE "accountCategory" ADD VALUE 'Viber';
ALTER TYPE "accountCategory" ADD VALUE 'GMX';
ALTER TYPE "accountCategory" ADD VALUE 'Quora';
ALTER TYPE "accountCategory" ADD VALUE 'Match';
ALTER TYPE "accountCategory" ADD VALUE 'Ourtime';
ALTER TYPE "accountCategory" ADD VALUE 'Hellotalk';
ALTER TYPE "accountCategory" ADD VALUE 'Zoosk';
ALTER TYPE "accountCategory" ADD VALUE 'Okcupid';
ALTER TYPE "accountCategory" ADD VALUE 'SMSmode';
ALTER TYPE "accountCategory" ADD VALUE 'Surfshark';
ALTER TYPE "accountCategory" ADD VALUE 'Website';
ALTER TYPE "accountCategory" ADD VALUE 'CryptoWebsite';
ALTER TYPE "accountCategory" ADD VALUE 'OnlyFans';
ALTER TYPE "accountCategory" ADD VALUE 'Tickets';
ALTER TYPE "accountCategory" ADD VALUE 'Tutorials';
ALTER TYPE "accountCategory" ADD VALUE 'Formats';
ALTER TYPE "accountCategory" ADD VALUE 'Accounts';
ALTER TYPE "accountCategory" ADD VALUE 'CreditCards';
ALTER TYPE "accountCategory" ADD VALUE 'Software';
ALTER TYPE "accountCategory" ADD VALUE 'Logs';
ALTER TYPE "accountCategory" ADD VALUE 'Tools';
ALTER TYPE "accountCategory" ADD VALUE 'Delivery';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "accountType" ADD VALUE 'Websites';
ALTER TYPE "accountType" ADD VALUE 'ToolsAndResources';
