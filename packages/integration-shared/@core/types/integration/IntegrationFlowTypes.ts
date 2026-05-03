export type IntegrationFlowType = {
  id?: number
  tenant?: string
  code?: string
  orderName?: string
  integrationDate?: Date
  originalFileName?: string
  extension?: string
  type?: string
  file?: File | null
  tags?: string[]
  createDate?: Date
  updateDate?: Date
  createdBy?: string
  updatedBy?: string
  fileContent?: string
}

export interface IntegrationFlowData {
  id?: number
  tenant: string
  code?: string
  orderName: string
  integrationDate?: Date
  originalFileName?: string
  extension?: string
  type?: string
  tags?: string[]
  file?: File | null
}
