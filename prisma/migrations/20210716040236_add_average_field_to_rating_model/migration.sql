/*
  Warnings:

  - Added the required column `average` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_id" INTEGER NOT NULL,
    "average" INTEGER NOT NULL,
    "one_star" INTEGER NOT NULL,
    "two_star" INTEGER NOT NULL,
    "three_star" INTEGER NOT NULL,
    "four_star" INTEGER NOT NULL,
    "five_star" INTEGER NOT NULL,
    FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("id", "item_id", "one_star", "two_star", "three_star", "four_star", "five_star") SELECT "id", "item_id", "one_star", "two_star", "three_star", "four_star", "five_star" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
CREATE UNIQUE INDEX "Rating_item_id_unique" ON "Rating"("item_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
