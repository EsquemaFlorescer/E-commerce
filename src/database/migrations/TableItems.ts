import { handle } from "../../utils/ErrorHandler"

function CreateTableItems(db) {
  const CreateTableItemsQuery = `
    CREATE TABLE IF NOT EXISTS items(
      uuid TEXT,
      created_at TEXT,
      name TEXT,
      category TEXT,
      orders TEXT
      image TEXT,
      price TEXT,
      stock TEXT,
      color TEXT
    );
  `

  db.run(CreateTableItemsQuery, err => handle(err, "Failed at creating table users."))
}

function DropTableItems(db) {
  db.run("DROP TABLE items;", err => handle(err, "Failed at dropping table items."))
}

export { CreateTableItems, DropTableItems }