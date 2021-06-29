import { Item, Rating, Image } from "@v1/entities"

import { Item as ItemType } from "@prisma/client"

export interface IItemsRepository {
  findById(id: number): Promise<Omit<ItemType, "image" | "rating"> | null>
  findAll(property?: string, sort?: "asc" | "desc" | string): Promise<ItemType[]>
  findAllPagination(page: number, quantity: number, property?: string, sort?: string): Promise<ItemType[] | Item[] | {}>
  save(item: Item): Promise<void>
  delete(id: number): Promise<void>
}