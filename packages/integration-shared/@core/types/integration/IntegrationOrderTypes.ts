export type IntegrationOrderType = {
    id?: number
    domain: string
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
    fileId: string

    //Audit info
    createDate?: any
    createdBy?: string
    updateDate?: any
    updatedBy?: string
}

export type IntegrationOrderData = {
    domain: string
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
    EXTRACT = 'EXTRACT',
}
