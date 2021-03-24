import { Request, Response } from "express"
import { User } from "../entities/User"

const UserController = {
  create(req: Request, res: Response) {
    const { name, email, password } = req.body

    const user = new User({ name, email, password })

    res.json(user)
  }
}

export { UserController }