export interface CategoryType {
  id?: number
  domain: string
  name: string
  description: string
  type: IEnumCategoryType,

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string

}

export enum IEnumCategoryType {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
}
