import { AdminStatus } from './accountTypes'
import { AddressTypes } from './addressTypes'

export type Tenant = {
  id: number
  name: string
  imagePath: string
  description: string
  email: string
  phone: string
  url: string
  tenant: string
  adminStatus: AdminStatus

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type TenantDetail = {
  id: number
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
  name: string
  description: string
  url: string
  adminStatus: string
  tenant: string
  code: string
  email: string
  phone: string
  lnk_facebook?: string
  lnk_linkedin?: string
  lnk_xing?: string
  address: AddressTypes
  imagePath: string
}

export type TenantRequest = {
  name: string
  url: string
  email: string
  phone: string
  description: string
  tenant: string
  adminStatus: AdminStatus
}

export type AdminTenantRequest = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export enum EnumLinkTenant {
  lnk_facebook = 'lnk_facebook',
  lnk_linkedin = 'lnk_linkedin',
  lnk_xing = 'lnk_xing'
}
