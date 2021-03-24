import { randomBytes } from "crypto"

interface CreateUserDTO {
  name: string
  email: string
  password: string
}

class User {
  public readonly uuid: string
  public readonly created_at: string

  public name: string
  public email: string
  public password: string

  constructor(props: CreateUserDTO) {
    this.uuid = randomBytes(20).toString("hex")
    this.created_at = new Date(Date.now()).toLocaleDateString()

    Object.assign(this, props)
  }
}

export { User }