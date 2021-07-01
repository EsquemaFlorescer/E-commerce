import { Request } from "express"
import { ParsedQs } from "qs"

import { IItemsRepository } from "@v1/repositories"
import { SqliteItemsRepository } from "@v1/repositories/implementations"

export class ReadItemService {
  constructor(
    private itemsRepository: IItemsRepository
  ) {}

  async read(id: string | number, { query }: Request<ParsedQs>) {
    try {
      // listing options
      let page: number = Number(query.page)
      let quantity: number = Number(query.quantity)
  
      let category: string = String(query.category)
      let sort: any = String(query.sort)
      let property: any = String(query.property)
      
      // if id is supplied search item with that id
      if(id != undefined) {
        const items = await this.itemsRepository.findById(Number(id))
  
        return {
          items
        }
      }
      
      // if no page and no quantity are supplied, list all items
      if(category != undefined && property != "undefined" && sort != "undefined") {
        const items = await this.itemsRepository.findAll(category, property, sort)
        
        return {
          items
        }
      }

      if(property != "undefined" && sort != "undefined") {
        const items = await this.itemsRepository.findAll(undefined, property, sort)
        
        return {
          items
        }
      }
      
      // if category is supplied search items with that category
      if(category != undefined) {
        const items = await this.itemsRepository.findAll(category, undefined, undefined)

        return {
          items
        }
      }
      
    } catch (error) {
      // console.log(error)
      throw new Error(error.message)
      return error
    }
  }
}

export default async (request: Request) => {
  try {
    // create sqlite repository
    const sqliteItemsRepository = new SqliteItemsRepository()

    // create read item service
    const readItem = new ReadItemService(sqliteItemsRepository)

    // execute item service
    const { items } = await readItem.read(request.params.id, request)
    // respond with item information
    return ({
      status: 202,
      message: "Listed items with success!",
      items
    })

  } catch (error) {
    // in case of error
    return ({
      error: true,
      status: 400,
      message: "Failed to read item."
    })
  }
}