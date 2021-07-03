import { Request } from "express"

import { IUsersRepository } from "@v1/repositories"
import { SqliteUsersRepository } from "@v1/repositories/implementations"

import { User } from "@v1/entities"
import auth from "@v1/auth"

class LoadAdminService {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async load(users: User[] | User) {
    try {
      if(Array.isArray(users)) {
        const user = users.forEach(async (user: User) => {
          const newUser = new User(user, {
            admin: {
              username: user.username,
              userhash: user.userhash
            }
          })

          const access_token = auth.create(newUser, "24h")
  
          await this.usersRepository.save(newUser)

          return {
            id: newUser.id,
            email: newUser.email,
            access_token
          }
        })

        return ({
          user
        })
      }

      const newUser = new User(users, {
        admin: {
          username: users.username,
          userhash: users.userhash
        }
      })

      await this.usersRepository.save(newUser)
      
      const access_token = auth.create(newUser, "24h")

      const user = {
        id: newUser.id,
        email: newUser.email,
        access_token
      }

      return ({
        user
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default async (request: Request) => {
  try {
    const usersRepository = new SqliteUsersRepository()
    const LoadAdmin = new LoadAdminService(usersRepository)

    const { user } = await LoadAdmin.load(request.body)

    return ({
      status: 200,
      user,
      message: "Loaded admin users from file."
    })
  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: "Failed to load admin users."
    })
  }
}