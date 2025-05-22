import { SharedWithType } from './SharedWith'
import { DocCommentType } from './DocComment'
import { CategoryTemplateType, IEnumDocTempStatus } from './categoryTemplateType'

export interface DocumentType {
  id?: number
  domain: string
  code: string
  name: string
  description: string
  editionDate: string
  shared: boolean
  type: IEnumDocTempStatus

  //Audit info
  createDate: string
  createdBy: string
  updateDate: string
  updatedBy: string

  sharedWithUsers: SharedWithType
  comments: DocCommentType
  template: CategoryTemplateType
}
