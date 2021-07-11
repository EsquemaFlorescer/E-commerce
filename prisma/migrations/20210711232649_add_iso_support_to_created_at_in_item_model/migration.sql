/*
  Warnings:

  - You are about to alter the column `created_at` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "short_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "shipping_price" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "category" TEXT NOT NULL
);
INSERT INTO "new_Item" ("id", "created_at", "name", "short_name", "description", "price", "shipping_price", "discount", "category", "brand") SELECT "id", "created_at", "name", "short_name", "description", "price", "shipping_price", "discount", "category", "brand" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
