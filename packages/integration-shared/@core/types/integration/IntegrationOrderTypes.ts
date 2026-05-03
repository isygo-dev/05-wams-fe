export type IntegrationOrderType = {
    id?: number
    tenant: string
    code?: string
    name: string
    description: string
    serviceName: string
    mapping: string
    integrationOrder: string
    originalFileName?: string
    extension?: string
    type?: string
    tags?: string[]
    file?: File | null
    fileId?: string

    //Audit info
    createDate?: any
    createdBy?: string
    updateDate?: any
    updatedBy?: string
}

export type IntegrationOrderData = {
    tenant: string
    name: string
    description: string
    serviceName: string
    mapping: string
    integrationOrder: string
    originalFileName: string
    extension: string
    type: string
    tags?: string[]
    file: File | null
    fileId: string
}

export enum integrationOrderType {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    EXTRACT = 'EXTRACT'
}
