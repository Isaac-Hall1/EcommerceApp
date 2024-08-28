/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ShoppingCart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_userId_key" ON "ShoppingCart"("userId");
