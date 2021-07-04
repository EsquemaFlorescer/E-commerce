import { Request, Response } from "express"

import { LoadFile } from "@v1/services/item"
import { LoadAdmin } from "@v1/services/user"
import { CreateDashSession } from "@v1/services/session"

export const DashboardController = {
  async loadFromFile(request: Request, response: Response) {
    const { error, status, message } = await LoadFile(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
    })
  },

  async loadAdmin(request: Request, response: Response) {
    const { error, status, message, user } = await LoadAdmin(request)

    if(error) return response.status(status).json(message)
    if(user == null) return
    response.header("authorization", user?.access_token)

    return response.status(status).json({
      user,
      message
    })
  },

  async login(request: Request, response: Response) {
    const {
      error,
      status,
      message,
      jwt_login,
      social_login,
      refresh_token
    } = await CreateDashSession(request)

    if(error) return response.status(status).json(message)

    response.header("authorization", refresh_token)

    return response.status(status).json({
      jwt_login,
      social_login,
      refresh_token
    })
  }
}