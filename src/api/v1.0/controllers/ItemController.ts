import { Request, Response } from "express"

import { prisma } from "@src/prisma"
import { CreateItem, ReadItem, UpdateItem, DeleteItem, RateItem } from "@v1/services/item"

const ItemController = {
  async create(request: Request, response: Response) {
    const { error, status, message, item } = await CreateItem(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      item
    })
  },

  async read(request: Request, response: Response) {
    const { error, status, message, items } = await ReadItem(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      items
    })
  },

  async update(request: Request, response: Response) {
    const { error, status, message, item } = await UpdateItem(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      item
    })
  },

  async delete(request: Request, response: Response) {
    const { error, status, message } = await DeleteItem(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json(message)
  },

  async rateItem(request: Request, response: Response) {
    const { error, status, message, item, average } = await RateItem(request)

    if(error) return response.status(status).json(message)

    return response.status(status).json({
      message,
      average,
      item
    })
  },

  async createImage(request: Request, response: Response) {
    const { itemId, link } = request.body

    try {
      const image = await prisma.image.create({
        data: {
          itemId,
          link
        }
      })

      return response.status(200).json({ image })

    } catch (error) {

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  },

  async removeImage(request: Request, response: Response) {
    const { id } = request.body

    try {
      const image = await prisma.image.delete({
        where: {
          id
        }
      })

      return response.status(200).json({ image })

    } catch (error) {

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  },

  async findByCategory(request: Request, response: Response) {
    let { category } = request.params

    try {
      const items = await prisma.item.findMany({
        where: {
          category
        }
      })

      return response.status(302).json({ items })

    } catch (error) {

      return response.status(500).json({ error: error.name, details: { message: error.message } })
    }
  }
}

export { ItemController }