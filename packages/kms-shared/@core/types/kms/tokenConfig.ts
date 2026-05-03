export type TokenConfigType = {
  id: number
  code: string
  tenant: string
  issuer: string
  audience: string
  signatureAlgorithm: string
  secretKey: string
  tokenType: string
}

export type TokenConfigTypes = {
  id?: number
  code?: string
  tenant?: string
  issuer?: string
  audience?: string
  signatureAlgorithm?: string
  secretKey?: string
  tokenType?: string
}

export type TokenData = {
  tenant: string
  issuer: string
  audience: string
  signatureAlgorithm: string
  secretKey: string
  tokenType: string
}
