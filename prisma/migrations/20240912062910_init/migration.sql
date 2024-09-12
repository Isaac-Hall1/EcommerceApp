/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_userName_key" ON "Product"("userName");
