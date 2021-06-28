import { Request, Response } from "express"
import { ParsedQs } from "qs"

import { IUsersRepository } from "@api/v1.0/repositories/IUsersRepository"
import { SqliteUsersRepository } from "@api/v1.0/repositories/implementations/SqliteUsersRepository"

import { User } from "@api/v1.0/entities/User"

type readUserResponse = {
  users: User[]
}

export class ReadUserService {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async read(id: string, { query }: Request<ParsedQs>) {
    try {
      // listing options
      let page: number = Number(query.page)
      let quantity: number = Number(query.quantity)
  
      let name: string = String(query.name)
      let sort: any = String(query.sort)
      let created_at: string = String(query.createdAt)
      
      // if id is supplied search user with that id
      if(id != undefined) {
        const users = await this.usersRepository.findById(id)
  
        return {
          users
        }
      }
  
      // if no page and no quantity is supplied, list all users
      if(!page && !quantity) {
        const users = await this.usersRepository.findAllUsers()
  
        return {
          users
        }
      }
  
      //
      if(name != "undefined") {
        // search for users with "x" name and sort it
        if(sort != "undefined") {
          const users = await this.usersRepository.findAllUsers({
            orderBy: [{
              name: sort
            }],
            
            // pagination
            take: quantity,
            skip: page * quantity
          })
  
          return { 
            users
          }
        }
  
        // search for users with "x" name
        const users = await this.usersRepository.findAllUsers({
          where: {
            name: {
              contains: name
            }
          },
  
          // pagination
          take: quantity,
          skip: page * quantity
        })
  
        return {
          users
        }
      }
  
      // if no name is supplied and created_at is supplied, sort by created_at
      if(name == "undefined" && created_at == "true" && sort != "undefined") {
        const users = await this.usersRepository.findAllUsers({
          orderBy: [{
            created_at: sort
          }],
  
          take: quantity,
          skip: page * quantity
        })
  
        return {
          users
        }
      }
  
      // if only page and quantity are supplied, sort users with pagination
      const users = await this.usersRepository.findAllUsers({
        take: quantity,
        skip: page * quantity
      })
  
      return {
        users
      }
    } catch (error) {
      return error
    }
  }
}

export default async (request: Request, response: Response) => {
  try {
    // create sqlite repository
    const sqliteUsersRepository = new SqliteUsersRepository()

    // create read user service
    const readUser = new ReadUserService(sqliteUsersRepository)

    // execute user service
    const { users }: readUserResponse = await readUser.read(request.params.id, request)

    // respond with user information
    return ({
      status: 202,
      users,
      message: "Listed users with success!"
    })

  } catch (error) {
    // in case of error
    return ({
      error: true,
      status: 400,
      message: "Failed to read user."
    })
  }
}