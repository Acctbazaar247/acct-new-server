-- CreateTable
CREATE TABLE "Kyc" (
    "id" TEXT NOT NULL,
    "ownById" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "meansOfIdentification" TEXT NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "identityImage" TEXT NOT NULL,

    CONSTRAINT "Kyc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kyc_id_key" ON "Kyc"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Kyc_ownById_key" ON "Kyc"("ownById");

-- AddForeignKey
ALTER TABLE "Kyc" ADD CONSTRAINT "Kyc_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
