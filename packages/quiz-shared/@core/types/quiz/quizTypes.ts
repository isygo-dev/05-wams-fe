export type QuizType = {
  id?: number
  code?: string
  name: string
  description: string
  category: string
  tags: string[]
  submitDate?: Date
  startDate?: Date
  score?: number
  scale?: number
  level: string
  domain: string

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type QuizDetailType = {
  id: number
  code: string
  name: string
  domain: string
  description: string
  category: string
  sections: Section[]
  tags: string[]
  level: string
}

export type Section = {
  id?: number
  name: string
  description: string
  order: number
  questions: Question[]
}

export type Question = {
  id: number
  question: string
  type: string
  language: string
  order: number
  options: Option[]
  textAnswer: string
  file: any
  imagePath: string
}

export enum QuestionType {
  TAQ = 'TAQ',

  MCQ = 'MCQ', // radio
  MCQM = 'MCQM', // checkobox

  MCTAQ = 'MCTAQ', // checkbox + textarea
  MCQA = 'MCQA', // radio + textarea
  CODE = 'CODE' // coding
}

export type Option = {
  id?: number
  option: string
  checked: boolean
}

export type ListItemsMenuType = {
  title: string
  name: string
}

export enum LevelType {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  CONFIRMED = 'CONFIRMED',
  EXPERT = 'EXPERT'
}
