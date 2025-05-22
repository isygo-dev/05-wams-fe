import { RoleTypes } from './roleTypes'
import { ThemeColor } from 'template-shared/@core/layouts/types'
import { AddressTypes } from './addressTypes'

export type AccountDto = {
  id?: number

  //common model
  code?: string
  email?: string
  fullName?: string
  origin?: string

  //ims definition
  domain?: string
  language?: string
  adminStatus?: string
  systemStatus?: string | undefined
  accountDetails?: AccountDetails
  roleInfo?: RoleTypes[] | undefined
  functionRole?: string
  imagePath?: string
  phoneNumber?: string
  isAdmin?: boolean
  authType?: string
  connectionTracking?: ConnectionTracking[]
  accountType?: string

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type MinAccountDto = {
  id?: number

  //common model
  code?: string
  email?: string
  fullName?: string
  origin?: string

  //ims definition
  domain?: string
  language?: string
  adminStatus?: string
  systemStatus?: string | undefined
  accountDetails?: AccountDetails
  roleInfo?: RoleTypes[] | undefined
  functionRole?: string
  imagePath?: string
  phoneNumber?: string
  isAdmin?: boolean
  authType?: string
  connectionTracking?: ConnectionTracking[]
  accountType?: string

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type MiniAccountChatType = {
  id?: number
  code: string
  email: string
  fullName: string
  imagePath?: string
  avatarColor?: string
  status: string
  colorStatus?: string
}

export type ShareResumeRequestDto = {
  resumeOwner: string
  accountsCode: MinAccountDto[]
}

export type ShareJobRequestDto = {
  jobOwner: string
  accountsCode: MinAccountDto[]
}

export enum AdminStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

export type ContactsType = {
  type?: string
  value?: number
}

export type Address = {
  country?: string
}

export type AccountDetails = {
  id?: number
  firstName?: string
  lastName?: string
  country?: string
  contacts?: ContactsType[]
  address?: AddressTypes
}

export type ConnectionTracking = {
  id: number
  browser: string
  loginDate: string
  device: string
  logApp?: string
  ipAddress: string
}

export type AdminStatusType = {
  [key: string]: ThemeColor
}

export const systemStatusObj: AdminStatusType = {
  IDLE: 'error',
  REGISTRED: 'success',
  LOCKED: 'secondary',
  TEM_LOCKED: 'info',
  EXPIRED: 'warning'
}
