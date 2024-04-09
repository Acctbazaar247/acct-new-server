-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'seller', 'superAdmin');

-- CreateEnum
CREATE TYPE "EPayWith" AS ENUM ('paystack', 'nowpay');

-- CreateEnum
CREATE TYPE "EVerificationOtp" AS ENUM ('createUser', 'forgotPassword', 'withdrawalPin');

-- CreateEnum
CREATE TYPE "accountCategory" AS ENUM ('Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Pinterest', 'Snapchat', 'TikTok', 'Threads', 'Tinder', 'Bumble', 'Reddit', 'Discord', 'Playstation', 'CallOfDuty', 'Pubg', 'Steam', 'Gta', 'Fortnite', 'Epic', 'Gmail', 'Ymail', 'Hotmail', 'MailRu', 'Outlook', 'Whatsapp', 'GoogleVoice', 'Telegram', 'WeChat', 'TextNow', 'TextPlus', 'Windscribe', 'Nord', 'Vpn911', 'Pia', 'Express', 'IpVanish', 'CyberGhost', 'Private', 'Total', 'Aliexpress', 'Alibaba', 'Amazon', 'Shopify', 'Ebay', 'Netflix', 'Apple', 'TrustWallet', 'Prime', 'AmazonPrimeVideos', 'AppleMusic', 'AppleTv', 'Spotify', 'Audiomack', 'YouTube', 'GitHub', 'Canva', 'ChatGPT', 'Office365', 'AmazonGiftCard', 'AmexGiftCard', 'EbayGiftCard', 'GooglePlayGiftCard', 'NikeGiftCard', 'NordStromGiftCard', 'PlaystationGiftCard', 'SephoraGiftCard', 'SteamGiftCard', 'Other');

-- CreateEnum
CREATE TYPE "accountType" AS ENUM ('SocialMedia', 'Game', 'Email', 'Vpn', 'GiftCard', 'ECommerce', 'AccountsSubscriptions', 'Other');

-- CreateEnum
CREATE TYPE "EApprovedForSale" AS ENUM ('pending', 'approved', 'denied');

-- CreateEnum
CREATE TYPE "EOrderStatus" AS ENUM ('pending', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "EStatusOfCurrencyRequest" AS ENUM ('pending', 'approved', 'denied');

-- CreateEnum
CREATE TYPE "EStatusOfWithdrawalRequest" AS ENUM ('pending', 'approved', 'denied');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "shouldSendEmail" BOOLEAN NOT NULL DEFAULT true,
    "txId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "profileImg" TEXT DEFAULT '/assets/demo-user.png',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isApprovedForSeller" BOOLEAN NOT NULL DEFAULT false,
    "isVerifiedByAdmin" BOOLEAN,
    "isBlocked" BOOLEAN,
    "isPaidForSeller" BOOLEAN,
    "withdrawalPin" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "payWith" "EPayWith",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationOtp" (
    "id" TEXT NOT NULL,
    "type" "EVerificationOtp" NOT NULL,
    "otp" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownById" TEXT NOT NULL,

    CONSTRAINT "VerificationOtp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "preview" TEXT,
    "additionalEmail" TEXT,
    "additionalPassword" TEXT,
    "additionalDescription" TEXT,
    "additionalImage" TEXT,
    "category" "accountCategory" NOT NULL,
    "accountType" "accountType" NOT NULL DEFAULT 'SocialMedia',
    "approvedForSale" "EApprovedForSale" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownById" TEXT NOT NULL,
    "isSold" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "orderById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EOrderStatus" DEFAULT 'completed',

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "ownById" TEXT NOT NULL,
    "status" "EStatusOfCurrencyRequest" NOT NULL DEFAULT 'pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'waiting',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrencyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "ownById" TEXT NOT NULL,
    "status" "EStatusOfWithdrawalRequest" NOT NULL DEFAULT 'pending',
    "fullName" TEXT,
    "accountNumber" TEXT,
    "bankName" TEXT,
    "walletAddress" TEXT,
    "isTrc" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "sendById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeenMessage" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "seenById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeenMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isSeen" BOOLEAN NOT NULL DEFAULT false,
    "ownById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_accountId_key" ON "Orders"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_id_key" ON "Cart"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_id_key" ON "Currency"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_ownById_key" ON "Currency"("ownById");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyRequest_id_key" ON "CurrencyRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalRequest_id_key" ON "WithdrawalRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SeenMessage_id_key" ON "SeenMessage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_id_key" ON "Notifications"("id");

-- AddForeignKey
ALTER TABLE "VerificationOtp" ADD CONSTRAINT "VerificationOtp_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_orderById_fkey" FOREIGN KEY ("orderById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency" ADD CONSTRAINT "Currency_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyRequest" ADD CONSTRAINT "CurrencyRequest_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sendById_fkey" FOREIGN KEY ("sendById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeenMessage" ADD CONSTRAINT "SeenMessage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeenMessage" ADD CONSTRAINT "SeenMessage_seenById_fkey" FOREIGN KEY ("seenById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
