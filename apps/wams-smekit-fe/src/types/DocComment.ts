import {DocumentType} from "./document";

export enum IEnumDocCommentsStaus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  VALIDATED = 'VALIDATED',

}
export interface DocCommentType {
  resolved: boolean;
  id?: number
  user: string
  document: Pick<DocumentType, 'id'>;
  type: IEnumDocCommentsStaus;
  startOffset: number
  endOffset: number
  textCommented:string
  text:string

  //Audit info
  createDate: string
  createdBy: string
  updateDate: string
  updatedBy: string
}


export interface DocCommentPayload {
  textCommented: string;
  text:string
  user: string;
  type: IEnumDocCommentsStaus;
  document: { id: number };
  startOffset: number;
  endOffset: number;
  id?: string;
}


