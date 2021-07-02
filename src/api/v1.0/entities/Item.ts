import { Rating } from "./Rating"
import { Image } from "./Image"

export class Item {
  public readonly created_at: Date

  public name: string
  public short_name: string
  public description: string

  public price: number
  public shipping_price: number
  public discount: number

  public category: string
  public image: Image[]

  public rating: Rating[]

  constructor(props: Omit<Item, "id">, image?: Image[]) {
    this.created_at = new Date()
    if(image) {
      this.image = image
    }
    Object.assign(this, props)
  }
}