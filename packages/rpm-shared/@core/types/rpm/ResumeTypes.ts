import { AddressTypes } from 'ims-shared/@core/types/ims/addressTypes'
import { ResumeDetails } from './ResumeDetails'
import { AdditionalFiles } from 'template-shared/@core/types/helper/fileTypes'

export type ResumeTypes = {
  birthDate: Date
  details: ResumeDetails
  domain: string
  email: string
  code?: string
  address: AddressTypes
  extension: string
  file: File
  firstName: string
  title: string
  id: number
  lastName: string
  nationality: string
  originalFileName: string
  phone: string
  presentation?: string
  imagePath: string
  resumeShareInfos: ResumeShareInfo[]
  tags: string[]
  version: number
  additionalFiles: AdditionalFiles[]
  accountCode?: string
}

export type MiniResume = {
  id: number
  code: string
  domain: string
  firstName: string
  title: string
  lastName: string
  phone: string
  email: string
  imagePath: string
  originalFileName: string
  resumeShareInfos: ResumeShareInfo[]
  details: ResumeDetails
  codeAccount: string
  extension: string

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type ResumeShareInfo = {
  id: number
  sharedWith: string
  rate: number
  comment: string
}

export type NewAdditionalFile = {
  id: number
  originalFileName: string
  size: number
}
