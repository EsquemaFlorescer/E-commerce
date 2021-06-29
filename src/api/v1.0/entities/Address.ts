export class Address {
  public readonly user_id: string

  public postal_code: string
  public city: string
  public state: string
  public street: string
  public number: number

  constructor(props: Omit<Address, "id">) {
    Object.assign(this, props)
  }
}