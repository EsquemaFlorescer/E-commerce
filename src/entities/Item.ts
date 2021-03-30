import { randomBytes } from "crypto"

interface CreateItemDTO {
  name: string
  short_name: string
  description: string
  price: string
  shipping_price: string
  discount: string
  category: string
  image: Array<any>
  orders: string
}

class Item {
  public readonly uuid
  public readonly created_at

  public name: string
  public short_name: string
  public description: string
  public price: string
  public shipping_price: string
  public discount: string
  public category: string
  public image: string
  public orders: number

  constructor(props: CreateItemDTO) {
    this.uuid = randomBytes(8).toString("hex")
    this.created_at = new Date(Date.now()).toLocaleDateString()
    
    
    Object.assign(this, props)
  }
}

export { Item }