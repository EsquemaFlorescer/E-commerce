import { Router } from "express"

import { UserController } from "./controllers/UserController"
import { ItemController } from "./controllers/ItemController"
import { SessionController } from "./controllers/SessionController"

const router = Router()

/* User */
router.post("/user/", UserController.create) /* Create user / Register */
router.post("/user/login", SessionController.create) /* Authenticate user / Login */ 
router.put("/user/edit", UserController.edit) /* Editing user */
router.delete("/user/delete", UserController.delete) /* Deleting a user */ 

router.get("/dashboard/", UserController.list) /* Listing all users */



/* Items */
router.post("/item/", ItemController.create)

export { router }