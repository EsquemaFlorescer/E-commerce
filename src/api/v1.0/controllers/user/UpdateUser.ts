import { Request, Response} from "express"

import { User } from "@prisma/client"
import { prisma } from "@src/prisma"

import { hash, genSalt } from "bcrypt"

import { handle } from "@utils/ErrorHandler"

type updateUserResponse = {
  usernameAlreadyExists: User[]
  available_usernames: string
  user: User
}

// create user service is responsible for authentication and some rules
const update = async (id: string, { name, lastname, username, cpf, email, password }: User) => {
  try {
    // middleware already checks for JWT
    
    const userInfo = await prisma.user.findUnique({
      where: {
        id
      },
      
      select: {
        userhash: true
      }
    })
    
    // searches user with the same username and userhash
    const usernameAlreadyExists = await prisma.user.findMany({
      where: {
        username,
        userhash: userInfo?.userhash
      },
      
      // select less user properties to reduce response time
      select: {
        id: true,
        username: true,
        userhash: true
      }
    })
    
    // if there is a user with the same username and userhash respond with other available usernames
    const available_usernames = [
      { username: `${username}${lastname}` },
      { username: `${name}${lastname}` }
    ]
    
    const salt = await genSalt(10)
    password = await hash(password, salt)
    
    // updates user
    const user = await prisma.user.update({
      where: {
        id
      },
      
      data: {
        name,
        email,
        lastname,
        cpf,
        username,
        password
      }
    })
    
    return {
      usernameAlreadyExists,
      available_usernames,
      user
    }
  } catch (error) {
    return error
  }
}

// just return everything from create user service
export default async (request: Request, response: Response) => {
  try {
    const {
      usernameAlreadyExists,
      available_usernames,
      user
    }: updateUserResponse = await update(request.params.id, request.body)
    
    if(usernameAlreadyExists.length) {
      return response.status(400).json({
        message: "Username already taken",
        available_usernames
      })
    }
    
    // respond with user information
    return response.status(200).json({
      user,
      message: "User updated with success!"
    })
    
  } catch (error) {
    // in case of error, send error details
    return handle.express(400, "Failed to create user.")
  }
}