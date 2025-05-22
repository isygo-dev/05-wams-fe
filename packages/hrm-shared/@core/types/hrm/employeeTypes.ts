import { ContractType } from './contractType'
import { AddressTypes } from 'ims-shared/@core/types/ims/addressTypes'

export type EmployeeType = {
  id?: number
  code?: string
  firstName: string
  lastName: string
  email: string
  imagePath: string
  phone: string
  domain: string
  address: AddressTypes
  details: EmployeeDetailType
  contracts: ContractType[]
  createDate?: Date | string
  updateDate?: Date | string
  extension: string
  file: File
  originalFileName: string
  employeeStatus?: EmployeeStatus
  functionRole?: string
}

export enum EmployeeStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

export type RequestEmployeeStatus = {
  id: number
  newStatus: EmployeeStatus
}

export type MinEmployeeType = {
  id?: number
  code?: string
  accountCode?: string
  firstName: string
  lastName: string
  email: string
  imagePath: string
  domain: string
  numberActiveContracts: number
  employeeStatus?: EmployeeStatus
  functionRole?: string

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type EmployeeDetailType = {
  id?: number
  placeofBirth?: string
  birthDate?: Date | string
  location?: string
  reportTo?: string
  cin: Cin[]
  securities: InsuranceSecurity[]
  passport: Passport[]
  securite: string
  gender?: IEnumGender
  civility?: IEnumCivility
  languages?: EmployeeLanguagesType[]
  emergencyContact?: EmergencyContactType
  familyInformation?: FamilyInformation
}

export type Cin = {
  id: number
  cardNumber: string
  code: string
  issuedDate: Date | string
  issuedPlace: string
  imagePath: string
  domain: string
  employeeDetailsId: number
}

export type Passport = {
  id: number
  cardNumber: string
  code: string
  issuedDate: Date | string
  expiredDate: Date | string
  issuedPlace: string
  imagePath: string
  domain: string
  employeeDetailsId: number
}

export type InsuranceSecurity = {
  id: number
  cardNumber: string
  code: string
  issuedDate: Date | string
  expiredDate: Date | string
  issuedPlace: string
  imagePath: string
  domain: string
  employeeDetailsId: number
  insuranceType: IEnumInsuranceType
}

export type FamilyInformation = {
  id: number
  spouseName: string
  numberOfChildren: number
  childrenInformations: ChildrenInformation[]
}

export type ChildrenInformation = {
  gender: IEnumGender
  fullName: string
  birthDate: Date | string
  educationalLevel: EducationalLevel
}

export type EmployeeLanguagesType = {
  languageName?: string
  level?: IEnumLanguageLevelType
}

export type EmergencyContactType = {
  name?: string
  relation?: string
  phoneNumber?: string
}

export enum IEnumCivility {
  M = 'M',
  S = 'S',
  D = 'D'
}

export enum IEnumInsuranceType {
  HEALTH_INSURANCE = 'HEALTH_INSURANCE',
  SOCIAL_SECURITY = 'SOCIAL_SECURITY'
}

export enum IEnumGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum EducationalLevel {
  HIGH_SCHOOL = 'High School',
  BACHELOR = 'Bachelor',
  MASTER = 'Master',
  DOCTORATE = 'Doctorate',
  PRIMARY_SCHOOL = 'Primary School',
  MIDDLE_SCHOOL = 'Middle School'
}

export type EmployeeTypeRequest = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  domain: string
  imagePath: string
  isLinkedToUser: boolean
}

export enum IEnumLanguageLevelType {
  FLUENT = 'FLUENT',
  ALRIGHT = 'ALRIGHT',
  GOOD = 'GOOD',
  INTERMEDIATE = 'INTERMEDIATE',
  BEGINNER = 'BEGINNER'
}
