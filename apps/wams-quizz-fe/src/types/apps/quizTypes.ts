export type QuizType = {
  id?: number
  code?: string
  name: string
  description: string
  category: string
}

export type QuizDetailType = {
  id: number
  code: string
  name: string
  description: string
  category: string
  sections: Section[]
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
  order: number
  options: Option[]
  textAnswer: string
}

export enum QuestionType {
  TAQ = 'TAQ',

  MCQ = 'MCQ', // radio
  MCQM = 'MCQM', // checkobox

  MCTAQ = 'MCTAQ', // checkbox + textarea
  MCQA = 'MCQA' // radio + textarea
}

export type Option = {
  id?: number
  option: string
  checked: boolean
}
