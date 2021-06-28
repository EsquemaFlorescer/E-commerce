import { genSaltSync, hashSync } from "bcrypt"
import { v4 as uuid } from "uuid"

export function randomNumber(number: number) {
  var add: number = 1
  var max: number = 12 - add

  if(number > max) {
    return randomNumber(max) + randomNumber(add - max)
  }

  max = Math.pow(10, number + add)
  var min = max / 10
  var number = Math.floor(Math.random() * (max - min + 1)) + min

  return ("" + number).substring(add)
}

export class User {
  public id: string
  public created_at: Date

  public name: string
  public lastname?: string | undefined
  public username?: string | any
  public userhash?: number | any
  public cpf?: string
  public email: string
  public password: string

  constructor(props: Omit<User, "id" | "created_at">, id?: string, created_at?: Date) {
    // if no id was supplied, generate uuid
    if(!id) this.id = uuid()

    if(id) this.id = id

    if(created_at) this.created_at = created_at
    
    // if no date was supplied, generate new ISO date
    if(!created_at) {
      this.created_at = new Date()
    }
    
    // create user object
    Object.assign(this, props)

    // generate user hash
    if(!props.username) this.username =`${this.name}`
    if(!props.userhash) this.userhash = randomNumber(4)

    // encrypt password
    const salt = genSaltSync(10)
    this.password = hashSync(this.password, salt)
  }
}