import {CategoryType} from "./category";
import {AuthorType} from "./author";
import {tagType} from "./tags";

export interface CategoryTemplateType {
  id?: number
  domain: string
  name: string
  description: string
  path: string
  file: File | null
  originalFileName: string | undefined
  extension: string
  editionDate: Date
  source: string
  version: string

  typeTs: IEnumDocTempStatus
  typeTv: IEnumTemplateVisibility
  typeTl: IEnumTemplateLanguage

  author?: AuthorType
  authorId?:number
  category?: CategoryType
  categoryId?: number
  tag:tagType

  type: string

  //Audit info
  createDate: string
  createdBy: string
  updateDate: string
  updatedBy: string
}
export enum IEnumTemplateLanguage {
  EN = 'EN',
  FR = 'FR',
  AR = 'AR',
  DE = 'DE',
  SPA = 'SPA',
  ITA = 'ITA',
}
export enum IEnumTemplateVisibility {
  PB = 'PB',
  PRV = 'PRV',
}
export enum IEnumDocTempStatus {
  EDITING = 'EDITING',
  VALIDATING = 'VALIDATING',
  REJECTED='REJECTED'
}
