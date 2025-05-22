import { tagType } from './tags'

export interface CategoryType {
  id?: number
  domain: string
  name: string
  description: string
  type: IEnumCategoryType
  imagePath: string
  tagName: tagType[]
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export enum IEnumCategoryType {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED'
}
