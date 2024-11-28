export type PebConfigType = {
    id: number
    code?: string
    domain?: string
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
    domain: string,
    algorithm: string,
    keyObtentionIterations: number,
    saltGenerator: string,
    ivGenerator: string,
    providerClassName: string,
    providerName: string,
    poolSize: number,
    stringOutputType: string,
}
