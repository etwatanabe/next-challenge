/*
  Warnings:

  - A unique constraint covering the columns `[stripeAccountId]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "stripeAccountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_stripeAccountId_key" ON "Seller"("stripeAccountId");
