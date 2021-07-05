import { Request } from "express"

import { IUsersRepository } from "@v1/repositories"
import { SqliteUsersRepository } from "@v1/repositories/implementations"

import { ParsedQs } from "qs"

class BanUserService {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async ban(id: string, { query }: Request<ParsedQs>) {
    try {
      const isShadowBan = String(query.shadow)
      const reason_for_ban = String(query.reason)

      if(isShadowBan != "undefined") {
        const user = await this.usersRepository.findById(id)
        
        if(user == null) throw new Error("Did not find user with that id.")

        await this.usersRepository.update({
          id: user.id,
          created_at: user.created_at,
          name: user.name,
          email: user.email,
          password: user.password,
          shadow_ban: true,
          ban: true,
          reason_for_ban
        })

        return
      }

      const user = await this.usersRepository.findById(id)

      if(user == null) throw new Error("Did not find user with that id.")

      await this.usersRepository.update({
        id: user.id,
        created_at: user.created_at,
        name: user.name,
        email: user.email,
        password: user.password,
        shadow_ban: false,
        ban: true,
        reason_for_ban
      })
    } catch (error) {
      throw new Error(error.message)
      return error
    }
  }
}

export default async (request: Request) => {
  try {
    const UsersRepository = new SqliteUsersRepository()
    const BanUser = new BanUserService(UsersRepository)

    await BanUser.ban(request.params.id, request)

    return ({
      status: 202,
      message: "Banned user with success!"
    })

  } catch (error) {
    return ({
      error: true,
      status: 400,
      message: "Failed to ban user."
    })
  }
}