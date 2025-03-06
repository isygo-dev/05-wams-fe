export interface AuthorType {
  id?: number
  name: string
  description: string
  url: string
  code: string

  //Audit info
  createDate: string
  createdBy: string
  updateDate: string
  updatedBy: string
}
