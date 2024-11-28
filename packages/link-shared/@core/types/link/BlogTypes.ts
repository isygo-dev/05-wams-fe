export type BlogType = {
    id?: any
    title?: string
    description?: string
    domain?: any
    accountCode: string
    createDate?: Date
    updateDate?: string | Date
    createdBy?: string
    updatedBy?: string
    file?: File
    imagePath?: string
    type?: string
    originalFileName?: string
}

export type BlogTalkType = {
    id?: number
    blogId: number
    text: string
    parent: any
    accountCode: string
    createDate?: any
    createdBy?: string
    updateDate?: any
    updatedBy?: string
}
