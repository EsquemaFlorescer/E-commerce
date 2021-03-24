import { Request, Response } from "express"
import { Save, Index } from "../database/models/UserModel"
import { User } from "../entities/User"
import { Save as SaveRequest } from "../utils/SaveRequest"

const UserController = {
  create(req: Request, res: Response) {
    SaveRequest(req)

    const { name, email, password } = req.body

    const user = new User({ name, email, password })
    Save(user)

    res.json(user)
  },

  list(req: Request, res: Response) {
    SaveRequest(req)

    Index(rows => {
      res.status(200).json({ users: rows })
    })
  }
}

export { UserController }