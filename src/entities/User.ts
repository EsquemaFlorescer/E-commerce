import { randomBytes } from "crypto"
import { hashSync } from "bcrypt"

interface CreateUserDTO {
  name: string
  email: string
  password: string
}

class User {
  public readonly uuid: string
  public readonly created_at: Date

  public name: string
  public email: string
  public password: string

  constructor(props: CreateUserDTO) {
    this.uuid = randomBytes(24).toString("hex")
    this.created_at = new Date()

    Object.assign(this, props)

    this.password = hashSync(this.password, 10)
  }
}

export { User }