export type CodificationTypes = {
  id?: number
  domain: string
  entity: string
  attribute: string
  prefix: string
  suffix: string
  value: number
  valueLength: number
  increment: number
  code?: string

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type CodificationData = {
  domain: string
  entity: string
  attribute: string
  prefix: string
  suffix: string
  value: number
  valueLength: number
  increment: number
}
