import {DocumentType} from "./document";

export interface SharedWithType {
  id?: number
  userName: string
  documentCode: DocumentType

  createDate: string
  createdBy: string
  updateDate: string
  updatedBy: string
}
