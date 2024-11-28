export type TransitionType = {
    id?: number
    code?: string
    fromCode: string
    toCode: string
    transitionService: string
    notify: boolean
    bidirectional: boolean
    watchers: string[]
}
