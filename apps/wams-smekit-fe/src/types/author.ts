export interface AuthorType {
  id?: number
  firstname: string
  lastname: string
  domain: string
  description: string
  code: string
  imagePath: string

  //Audit info
  createDate: string
  createdBy: string
  updateDate: string
  updatedBy: string
}
