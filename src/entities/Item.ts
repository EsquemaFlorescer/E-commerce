import { randomBytes } from "crypto"

interface CreateItemDTO {
  name: ItemName
  image: string
  price: ItemPrice
  stock: string
  color: string
}

interface ItemName {
  full_name: string
  short_name: string
  brand: string
  manufacturer: string
}

interface ItemPrice {
  discount: string
  shipping: string
  full_price: string
}

class Item {
  public readonly uuid
  public readonly created_at

  public name: ItemName
  public image: string
  public price: ItemPrice
  public stock: string
  public color: string

  constructor(props) {
    this.uuid = randomBytes(8).toString("hex")
    this.created_at = new Date(Date.now()).toLocaleDateString()

    Object.assign(this, props)
  }
}

export { Item }