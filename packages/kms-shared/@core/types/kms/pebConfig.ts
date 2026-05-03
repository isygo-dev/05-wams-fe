export type PebConfigType = {
  id: number
  code?: string
  tenant?: string
  algorithm?: string
  keyObtentionIterations?: number
  saltGenerator?: string
  ivGenerator?: string
  providerClassName?: string
  providerName?: string
  poolSize?: number
  stringOutputType?: string
}

export type PebConfigData = {
  tenant: string
  algorithm: string
  keyObtentionIterations: number
  saltGenerator: string
  ivGenerator: string
  providerClassName: string
  providerName: string
  poolSize: number
  stringOutputType: string
}
