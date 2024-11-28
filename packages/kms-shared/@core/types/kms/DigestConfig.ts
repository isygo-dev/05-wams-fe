export type DigestConfigTypes = {
    id: number
    code?: string
    domain?: string
    algorithm?: string
    iterations?: number
    saltSizeBytes?: number
    saltGenerator?: string
    providerClassName?: string
    providerName?: string
    invertPositionOfSaltInMessageBeforeDigesting?: boolean
    invertPositionOfPlainSaltInEncryptionResults?: boolean
    useLenientSaltSizeCheck?: boolean
    poolSize?: number
    unicodeNormalizationIgnored?: boolean
    stringOutputType?: string
    prefix?: string
    suffix?: string

}

export type DigestConfigType = {
    id?: number
    code?: string
    domain?: string
    algorithm?: string
    iterations?: number
    saltSizeBytes?: number
    saltGenerator?: string
    providerClassName?: string
    providerName?: string
    invertPositionOfSaltInMessageBeforeDigesting?: boolean
    invertPositionOfPlainSaltInEncryptionResults?: boolean
    useLenientSaltSizeCheck?: boolean
    poolSize?: number
    unicodeNormalizationIgnored?: boolean
    stringOutputType?: string
    prefix?: string
    suffix?: string

}

export type DigestConfigData = {
    domain: string
    algorithm: string
    iterations: number
    saltSizeBytes: number
    saltGenerator: string
    providerClassName: string
    providerName: string
    invertPositionOfSaltInMessageBeforeDigesting: boolean
    invertPositionOfPlainSaltInEncryptionResults: boolean
    useLenientSaltSizeCheck: boolean
    poolSize: number
    unicodeNormalizationIgnored: boolean
    stringOutputType: string
    prefix: string
    suffix: string
}
