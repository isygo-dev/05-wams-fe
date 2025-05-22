import {DocumentType} from "./document";

export interface DocCommentType {
  id?: number
  text: string
  user: string
  type: string
  document: DocumentType
  DocCommentsStaus: IEnumDocCommentsStaus

  //Audit info
  createDate: string
  createdBy: string
  updateDate: string
  updatedBy: string
}

export enum IEnumDocCommentsStaus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  VALIDATED = 'VALIDATED',

}


