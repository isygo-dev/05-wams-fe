import { ApplicationType } from './applicationTypes'

export type MinRoleTypes = {
  id?: number
  code: string
  name: string
  description: string
  allowedTools: []
}

export type RoleData = {
  name: string
  description: string
}

export type RoleTypes = {
  id?: number
  code?: string
  domain?: string
  name?: string
  templateCode?: string
  description?: string
  numberOfUsers?: number
  level: number
  allowedTools: ApplicationType[]
  rolePermission: RolePermission[]

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type RolePermission = {
  id?: number
  serviceName: string
  objectName: string
  read: boolean
  write: boolean
  delete: boolean
}

export type ListCheckBox = {
  serviceName: string
  objectName: string
  option: string
}
