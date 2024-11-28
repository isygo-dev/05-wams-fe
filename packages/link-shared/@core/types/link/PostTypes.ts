export type PostType = {
    id?: number
    createDate?: Date
    createdBy?: string
    updateDate?: Date
    updatedBy?: string
    domain?: string
    accountCode?: string
    title?: string
    talk: string
    editable?: boolean
    comments?: CommentType[]
    usersAccountCode?: string[]
    usersAccountCodeDislike?: string[]
    file?: File
    imagePath?: string
    isLike?: boolean
    showComments?: boolean
    type?: string
    originalFileName?: string
    isBlog?: boolean
}

export type CommentType = {
    id?: number
    createDate?: string
    createdBy?: string
    updateDate?: string | Date
    updatedBy?: string
    accountCode: string
    text: string
    postId: number
    usersAccountCode?: string[]
    hideBtn?: boolean
    parentCommentId?: number
}
