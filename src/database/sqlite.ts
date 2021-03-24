import { Database } from "sqlite3"

const db = new Database("./src/database/app.db")

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users(
    name TEXT,
    email TEXT,
    password TEXT
  );`, err => {
    if(err) console.log(err)

    console.log("Creating table users")
  })
})

export { db }