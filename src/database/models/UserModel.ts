import { handle } from "../../utils/ErrorHandler"
import { db } from "../sqlite"

function Save(user) {
  const SaveUserQuery = `INSERT INTO users(uuid, created_at, name, email, password) VALUES (?, ?, ?, ?, ?);`
  const Values = Object.values(user)

  db.all(SaveUserQuery, Values, err => handle(err, "Failed at storing user."))
}

function Index(callbackFunction) {
  const ListUsersQuery = `SELECT * FROM users;`

  db.all(ListUsersQuery, (err, rows) => {
    handle(err, "Failed at listing all users.")

    callbackFunction(rows)
  })
}

export { Save, Index }