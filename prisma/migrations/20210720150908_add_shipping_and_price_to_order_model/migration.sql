-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "shipping_price" INTEGER NOT NULL,
    "all_items_price" INTEGER NOT NULL,
    FOREIGN KEY ("payment_id") REFERENCES "Payment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("address_id") REFERENCES "Address" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
