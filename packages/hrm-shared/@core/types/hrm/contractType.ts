import { AdditionalFiles } from 'template-shared/@core/types/helper/fileTypes'

export type ContractType = {
  id?: number
  code?: string
  location: string
  workingMode: IEnumLocationType
  contract: IEnumContractType
  availability: IEnumTimeType
  probationaryPeriod: number
  startDate: Date
  endDate: Date
  vacationBalance: number
  isRenewable: boolean
  isContractRenewable: boolean
  domain: string
  employee: number
  extension: string
  file: File
  originalFileName: string
  salaryInformation: SalaryInformation
  holidayInformation: CongeInformation[]
  additionalFiles: AdditionalFiles[]
  advantages: Advantage[]
  equipments: Advantage[]
  contractAmendments?: ContractAmendment[]
}

export type MinContractType = {
  id?: number
  code?: string
  contract: IEnumContractType
  startDate: Date
  endDate: Date
  domain: string
  employee: number
  isLocked: boolean
  createDate: Date | string
  updateDate: Date | string
}

export type CongeInformation = {
  legalLeaveCount: number
  feedingFrequency: number
  recoveryLeaveCount: number
  recoveryFeedingFrequency: number
}

export type SalaryInformation = {
  id: number
  grossSalary: number
  netSalary: number
  salaryType: IEnumSalaryType
  frequency: number
  primes: Prime
  currency: string
  paymentSchedules?: PaymentSchedule[]
}

export type Prime = {
  id: number
  primeType: IEnumPrime
  annualMaxAmount: number
  annualMinAmount: number
  annualFrequency: number
  bonusSchedules: PaymentBonusSchedule
}

export type ContractTypeRequest = {
  id: number
  contract: IEnumContractType
  domain: string
  employee: number
}

export type RequestContractStatus = {
  id: number
  isLocked: boolean
}

export type PaymentSchedule = {
  id: number
  isSubmited: boolean
  submitDate: Date
  dueDate: Date
  paymentGrossAmount: number
  paymentNetAmount: number
}

export type PaymentBonusSchedule = {
  id: number
  isSubmited: boolean
  submitDate: Date
  dueDate: Date
  paymentAmount: number
}

export type Advantage = {
  id: number
  type: string
  description: string
}

export type ContractAmendment = {
  id: number
  type: string
  description: string
  date: Date
}

export enum IEnumContractType {
  INTERIM = 'INTERIM',
  INTERNSHIP = 'INTERNSHIP',
  CDD = 'CDD',
  CDI = 'CDI'
}

export enum IEnumSalaryType {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE'
}

export enum IEnumLocationType {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  PRESENTIAL = 'PRESENTIAL'
}

export enum IEnumTimeType {
  FULLTIME = 'FULLTIME',
  PARTTIME = 'PARTTIME'
}

export enum IEnumPrime {
  CASH = 'CASH',
  BENEFITS = 'BENEFITS',
  BONUS = 'BONUS',
  ALLOWANCE = 'ALLOWANCE',
  COMMISSION = 'COMMISSION',
  STOCK_OPTIONS = 'Stock STOCK_OPTIONS',
  PROFIT_SHARING = 'PROFIT_SHARING',
  OVERTIME = 'OVERTIME',
  INCENTIVES = 'INCENTIVES',
  PER_DIEM = 'PER_DIEM',
  RETENTION = 'RETENTION',
  OTHER = 'OTHER'
}
