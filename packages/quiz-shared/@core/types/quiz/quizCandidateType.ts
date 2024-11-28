export type QuizCandidateType = {
    id?: number
    accountCode?: string
    quizCode?: string
    startDate?: Date
    submitDate?: Date
    score?: number
}

export type QuizAnswerType = {
    id?: number
    question?: number
    option?: number
    answerText?: string
}

export type CandidateQuizReportType = {
    id?: number
    code?: string
    description: string
    name: string
    score: number
    sections: sectionDetailsType[]
}

export type sectionDetailsType = {
    id?: number
    description: string
    name: string
    score: number
    order: number
    questions: QuestionDetailsType[]
}

export type QuestionDetailsType = {
    id?: number
    durationInSec: number
    locked: boolean
    score: number
    order: number
    question: string
    remainInSec: number
    textAnswer: string
    type: string
    options: OptionDetailsType[]
    imagePath: string
}

export type OptionDetailsType = {
    id?: number
    checked: boolean
    option: string
    textAnswer: string
}

export type AnswerType = {
    id?: number
    question: number
    option?: number
    answerText: string
    score: number
}
