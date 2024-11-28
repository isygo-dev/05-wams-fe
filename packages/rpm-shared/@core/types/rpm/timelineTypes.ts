export type timelineType = {
    id: number
    action: 'PERSIST' | 'UPDATE' | 'REMOVE'
    code: string
    object: string
    parentCode: string
    createDate: Date
    updateDate: Date
}
