-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "card_brand" TEXT,
    "card_number" TEXT,
    "card_month" TEXT,
    "card_year" TEXT,
    "card_code" TEXT,
    FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
