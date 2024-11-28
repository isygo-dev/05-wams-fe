export type TokenConfigType = {
    id: number
    code: string
    domain: string
    issuer: string
    audience: string
    signatureAlgorithm: string
    secretKey: string
    tokenType: string
}

export type TokenConfigTypes = {
    id?: number
    code?: string
    domain?: string
    issuer?: string
    audience?: string
    signatureAlgorithm?: string
    secretKey?: string
    tokenType?: string
}

export type TokenData = {
    domain: string
    issuer: string
    audience: string
    signatureAlgorithm: string
    secretKey: string
    tokenType: string
}

