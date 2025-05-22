import { ApplicationType } from 'ims-shared/@core/types/ims/applicationTypes'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  domain: string
  application: string
  userName: string
  password: string
  rememberMe?: boolean
  authType?: string
}

export type ResetPaswordParams = {
  domain: string
  userName: string
}

export type ResetPaswordRequest = {
  domain: string
  userName: string
  fullName: string
  application: string
}

export type ChangePasswordParams = {
  token: string | string[]
  password: string
}

export type ChangePasswordRequest = {
  token: string | string[]
  password: string
  application: string
}

export type UserDataType = {
  id?: number
  role: string
  functionRole?: string
  email: string
  firstName: string
  lastName: string
  userName: string
  language?: string
  applications: ApplicationType[]
  domainId: number
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
