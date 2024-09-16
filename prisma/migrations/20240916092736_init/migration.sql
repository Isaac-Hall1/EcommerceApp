/*
  Warnings:

  - Added the required column `paymentType` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sellLocation" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "Category" TEXT NOT NULL DEFAULT 'Venmo',
    CONSTRAINT "Product_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("Category", "createdAt", "description", "id", "name", "price", "sellLocation", "updatedAt", "userName") SELECT "Category", "createdAt", "description", "id", "name", "price", "sellLocation", "updatedAt", "userName" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
