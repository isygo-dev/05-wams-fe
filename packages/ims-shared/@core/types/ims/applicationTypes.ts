import {AdminStatus} from './accountTypes'

export type ApplicationType = {
    id?: number
    tenant: string
    code?: string
    category: string
    name: string
    title: string
    imagePath?: string
    description: string
    url: string
    adminStatus: AdminStatus
    token?: Token
    order: number

    //Audit info
    createDate?: Date
    createdBy?: string
    updateDate?: Date
    updatedBy?: string
}

export type Token = {
    type: string
    token: string
}
