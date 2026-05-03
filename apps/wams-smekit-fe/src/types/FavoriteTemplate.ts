import {CategoryTemplateType} from './categoryTemplateType'

export interface FavoriteTemplateType {
  id: number
  tenant: string
  code: string
  template: CategoryTemplateType
  userId: number
  note?: string
  createDate: string
  createdBy: string
  updateDate?: string
  updatedBy?: string
}

export interface FavoriteTemplateDto {
  templateId: number
  userId: number
  note?: string
}
