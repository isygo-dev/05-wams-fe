export interface AuthorType {
  id?: number
  firstname: string
  lastname: string
  domain: string
  code: string
  imagePath: string
  email: string
  phone: string
  type: string

  //file
  file?: File | null
  originalFileName?: string | undefined
  path: string
  fileName: string
  extension: string

 //file

  //Audit info
  createDate?: string
  createdBy?: string
  updateDate?: string
  updatedBy?: string
}
