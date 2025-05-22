import { AdminStatus } from './accountTypes'
import { AddressTypes } from './addressTypes'

export type DomainType = {
  id: number
  name: string
  imagePath: string
  description: string
  email: string
  phone: string
  url: string
  domain: string
  adminStatus: AdminStatus

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type DomainDetailType = {
  id: number
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
  name: string
  description: string
  url: string
  adminStatus: string
  domain: string
  code: string
  email: string
  phone: string
  lnk_facebook?: string
  lnk_linkedin?: string
  lnk_xing?: string
  address: AddressTypes
  imagePath: string
}

export type DomainTypeRequest = {
  name: string
  url: string
  email: string
  phone: string
  description: string
  domain: string
  adminStatus: AdminStatus
}

export type AdminDomainTypeRequest = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export enum EnumLinkDomain {
  lnk_facebook = 'lnk_facebook',
  lnk_linkedin = 'lnk_linkedin',
  lnk_xing = 'lnk_xing'
}
