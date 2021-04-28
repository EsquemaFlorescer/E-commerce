import jwt from "jsonwebtoken"
import { Request, Response } from "express"
import { Save as SaveRequest } from "@utils/SaveRequest"
import { prisma } from "../prisma"
import { User } from "@prisma/client"

const UserController = {
  async create(request: Request, response: Response) {
    SaveRequest(request)

    const { name, email, password }: User  = request.body

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password
        }
      })
  
      const access_token = jwt.sign({ 
        id: user.id, 
        name, 
        email, 
        password: user.password 
      }, String(process.env.JWT_ACCESS_TOKEN), { expiresIn: "24h" })
  
      response.header("authorization", access_token)
  
      return response.status(201).json({ auth: true, access_token, user, message: "User created with success!" })
      
    } catch (error) {

      return response.status(500).json({
        message: error.message
      })
    }
  },

  async updateUser(request: Request, response: Response) {
    SaveRequest(request)

    const { id, name, last_name, cpf, email, password, address } = request.body

    const authorizationHeader = request.headers.authorization
    const jwtHeader = jwt.verify(String(authorizationHeader), String(process.env.JWT_REFRESH_TOKEN))

    try {
      const user = await prisma.user.update({
        where: {
          id
        },

        data: {
          name,
          last_name,
          cpf,
          email,
          password,
          address
        }
      })

      return response.status(200).json({ auth: true, jwtHeader, user, message: "User edited with success!" })

    } catch (error) {

      return response.status(400).json({ 
        auth: false, 
        message: error.message 
      })
    }
  },

  delete(req: Request, res: Response) {
    SaveRequest(req)

    const authHeader = req.headers.authorization

    try {
      const jwtHeader = jwt.verify(String(authHeader), String(process.env.JWT_REFRESH_TOKEN))

      Delete(jwtHeader["uuid"])
      return res.status(200).json({ auth: true, message: "User deleted with success" })
    } catch (error) {
      return res.status(400).json({ auth: false, message: "JWT token invalid, go back to login page" })
    }
  },

  list(req: Request, res: Response) {
    SaveRequest(req)

    Index((rows: any) => {
      return res.status(200).json({ users: rows })
    })
  }
}

export { UserController }