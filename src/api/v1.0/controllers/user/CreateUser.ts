import { Request, Response} from "express"

import { User } from "@prisma/client"
import { prisma } from "@src/prisma"

import { hash, genSalt } from "bcrypt"

import auth from "@auth"
import { handle } from "@utils/ErrorHandler"

export function randomNumber(num: number) {
  var add = 1
  var max = 12 - add
  
  if(num > max) {
    return randomNumber(max) + randomNumber(Number(num) - max)
  }
  
  max = Math.pow(10, num + add)
  var min = max / 10
  var number = Math.floor(Math.random() * (max - min + 1)) + min
  
  return ("" + number).substring(add)
}

export default async function create(request: Request, response: Response) {
  let { name, email, cpf, password }: User = request.body
  
  try {    
    const users = await prisma.user.findMany({
      select: {
        name: true,
        userhash: true,
        email: true
      }
    })

    // TODO: integrate this with discord user hash
    let userhash = randomNumber(4)
    
    // searcher for duplicate user hash
    const userHashAlreadyExists = users.filter(user => user.name == name && user.userhash == userhash)
    
    // searches users with that e-mail
    const userAlreadyExists = users.filter(user => user.email == email)
    
    // if user with name and hash already exist generate another hash
    if(userHashAlreadyExists) {
      userhash = randomNumber(4)
    }
    
    // checks if user with that email already exists
    if (userAlreadyExists.length) {
      return response.status(400).json({
        auth: false, message: "User already exists", user: userAlreadyExists
      })
    }
    
    const salt = await genSalt(10)
    password = await hash(password, salt)
    
    // stores user in the database
    const user = await prisma.user.create({
      data: {
        name,
        lastname: "",
        username: `${name}${randomNumber(2)}`,
        userhash: String(userhash),
        cpf,
        email,
        password
      }
    })
    
    // creates JWT access token
    const access_token = auth.create(user, "24h")
    
    // sends JWT through headers
    response.header("authorization", access_token)
    
    // respond with user information
    return response.status(201).json({ auth: true, access_token, user, message: "User created with success!" })
    
  } catch (error) {
    
    // in case of error, send error details
    return handle.express(500, { auth: false, message: "Failed to create user." })
  }
}