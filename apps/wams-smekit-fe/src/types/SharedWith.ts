import {DocumentType} from "./document";

export enum IEnumPermissionLevel {
  READ = 'READ',
  EDIT = 'EDIT',

}
export interface SharedWithType {
  id?: number
  user: string
  document: DocumentType
  permission: IEnumPermissionLevel;

  createDate: string
  createdBy: string
  updateDate: string
  updatedBy: string
}
