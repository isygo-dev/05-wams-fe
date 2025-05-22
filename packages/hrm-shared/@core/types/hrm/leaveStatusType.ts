export type LeaveStatusType = {
  id?: number
  codeEmployee?: string
  nameEmployee?: string
  leaveCount?: number
  leaveTakenCount?: number
  remainingLeaveCount?: number
  recoveryLeaveCount?: number
  recoveryLeaveTaken?: number
  startDate?: string
  endDate?: string
  vacation: Vacation[]
}

export type Vacation = {
  id?: number
  startDate?: string
  endDate?: string
  leaveTaken: number
  recoveryLeaveTaken: number
  absence: IEnumAbsenceType
  status: IEnumStatusType
  comment: string
}

export enum IEnumStatusType {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED'
}

export enum IEnumAbsenceType {
  ANNUAL_LEAVE = 'ANNUAL_LEAVE',
  RECOVERY_HOLIDAY = 'RECOVERY_HOLIDAY',
  AUTORISATION = 'AUTORISATION',
  SICK_LEAVE = 'SICK_LEAVE',
  MATERNITY_LEAVE = 'MATERNITY_LEAVE',
  PATERNITY_LEAVE = 'PATERNITY_LEAVE',
  UNPAID_LEAVE = 'UNPAID_LEAVE',
  OTHER = 'OTHER'
}
