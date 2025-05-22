export type TemplateType = {
  id?: number
  domain: string
  name: string
  description: string
  code: string
  path: string
  language: string
  file: File
}

export type TemplateTypes = {
  domain: string
  name: string
  description: string
  language: string
  file?: File
}

export type templateDetailsDataType = {
  id: number | null
  templateDetailsData: TemplateType
  file: File | null
}

export enum IEnumLanguageType {
  AR = 'AR',
  FR = 'FR',
  EN = 'EN',
  DE = 'DE',
  IT = 'IT',
  GE = 'GE'
}
