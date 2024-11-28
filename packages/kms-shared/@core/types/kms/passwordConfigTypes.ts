export type PasswordConfigType = {

    id: number
    code: string
    domain: string
    pattern: string
    charSetType: string
    initialPassword: string
    minLenght: number
    maxLenth: number
    lifeDays: number
}


export type PasswordConfigData = {

    domain: string
    pattern: string
    charSetType: string
    initialPassword: string
}

export type PasswordConfigTypes = {

    domain: string
    pattern: string
    initialPassword: string
}
