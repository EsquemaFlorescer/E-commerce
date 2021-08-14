import { Router } from "express"

import user from "./entities/user"
import item from "./entities/item"

const router = Router()

router.use("/user", user)
router.use("/item", item)

// todo:
/**
 * v1: db drivers (sqlite3, pg, mysql)
 * v2: Query builder (knex.js, prisma)
 * v3: ORM (MikroORM, Typeorm, Sequelize)
 * v4: MongoDB
 * v5: GraphQL
 * v6: like rocketseat (with classes, services, repositories)
 */
export { router }