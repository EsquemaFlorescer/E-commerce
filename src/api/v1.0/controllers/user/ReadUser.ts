import { Request, Response } from "express"
import { ParsedQs } from "qs"

import { User } from "@prisma/client"
import { prisma } from "@src/prisma"

type readUserResponse = {
  users: User[]
}

const read = async (id: string, { query }: Request<ParsedQs>) => {
  try {
    // listing options
    let page: number = Number(query.page)
    let quantity: number = Number(query.quantity)

    let name: string = String(query.name)
    let sort: any = String(query.sort)
    let created_at: string = String(query.createdAt)
    
    // if id is supplied search user with that id
    if(id != undefined) {
      const users = await prisma.user.findUnique({
        where: {
          id
        }
      })

      return {
        users
      }
    }

    // if no page and no quantity is supplied, list all users
    if(!page && !quantity) {
      const users = await prisma.user.findMany()

      return {
        users
      }
    }

    //
    if(name != "undefined") {
      // search for users with "x" name and sort it
      if(sort != "undefined") {
        const users = await prisma.user.findMany({
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
      const users = await prisma.user.findMany({
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
      const users = await prisma.user.findMany({
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
    const users = await prisma.user.findMany({
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

export default async (request: Request, response: Response) => {
  try {
    const { users }: readUserResponse = await read(request.params.id, request)

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