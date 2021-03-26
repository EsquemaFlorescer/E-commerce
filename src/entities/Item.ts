import { randomBytes } from "crypto"

interface CreateItemDTO {
  name: ItemName
  category: string
  image: Array<any>
  price: ItemPrice
  stock: string
  color?: string
}

interface ItemName {
  full_name: string
  short_name: string
  brand: string
  manufacturer: string
}

interface ItemPrice {
  discount: string
  shipping_price: string
  full_price: string
}

class Item {
  public readonly uuid
  public readonly created_at

  public name: ItemName
  public category: string
  public orders: number = 0
  public image: string
  public price: ItemPrice
  public stock: string
  public color?: string

  constructor(props: CreateItemDTO) {
    this.uuid = randomBytes(8).toString("hex")
    this.created_at = new Date(Date.now()).toLocaleDateString()
    
    
    Object.assign(this, props)
    this.orders += 1
  }
}

export { Item }