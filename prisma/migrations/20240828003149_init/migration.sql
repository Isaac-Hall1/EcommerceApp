/*
  Warnings:

  - A unique constraint covering the columns `[shoppingCartId,productId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CartItem_shoppingCartId_productId_key" ON "CartItem"("shoppingCartId", "productId");
