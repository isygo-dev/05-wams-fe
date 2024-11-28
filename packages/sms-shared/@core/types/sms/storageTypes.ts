export type StorageConfigType = {
    id: number
    domain: string
    type: string
    userName: string
    password: string
    url: string
}

export type StorageConfigTypes = {
    id?: number
    domain?: string
    type?: string
    userName?: string
    password?: string
    url?: string
}

export type StorageConfigTypeRequest = {
    domain: string,
    url: string,
    userName: string,
    type: string,
    password: string
}
