export type StorageConfigType = {
  id: number
  tenant: string
  type: string
  userName: string
  password: string
  url: string
}

export type StorageConfigTypes = {
  id?: number
  tenant?: string
  type?: string
  userName?: string
  password?: string
  url?: string
}

export type StorageConfigTypeRequest = {
  tenant: string
  url: string
  userName: string
  type: string
  password: string
}
