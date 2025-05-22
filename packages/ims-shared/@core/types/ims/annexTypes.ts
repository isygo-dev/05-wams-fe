export enum Language {
  AR = 'ar',
  FR = 'fr',
  EN = 'en',
  DE = 'de'
}

export type AnnexType = {
  id?: number
  tableCode?: string
  domain?: string
  language?: Language
  value?: string
  description?: string
  reference?: string
  annexOrder?: number
}

export enum IEnumAnnex {
  FUNCTION_ROL = 'FUNROL',
  QUIZ_CATEGORY = 'QIZCAT',
  CURRENCY_AMOOUNT = 'CURNCY',
  JOB_INDUSTRY = 'JOBIND',
  EMPLOYER_TYPE = 'EMPTYP',
  JOB_FUNCTION = 'JOBFUN',
  EDUCATION_LEVEL = 'EDULEV',
  CONTRACT_ADVANTAGE = 'CTRADV',
  CONTRACT_EQUPMENT = 'CTREQUI',
  CONTRACT_AMENDMENT = 'CTRAMD',
  APP_CATEGORY = 'APPCAT'
}
