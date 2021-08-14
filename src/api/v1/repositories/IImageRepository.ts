import { Image } from "@v1/entities"

export interface IImageRepository {
  save(id: number, image: Image): Promise<void>
  delete(id: number, user_id: number): Promise<void>
}