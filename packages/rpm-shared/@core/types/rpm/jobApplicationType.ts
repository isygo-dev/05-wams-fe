// jobApplicationModel.ts
import {ResumeTypes} from './ResumeTypes'
import {JobOfferType} from './jobOfferTypes'

export type JobApplicationType = {
    id?: number
    resume: { code: string }
    jobOffer: { code: string }
}

export type JobApplicationEventType = {
    domain: string
    resume: ResumeTypes
    jobOffer: JobOfferType
}

export type InterviewEventType = {
    id?: number
    title: string
    type: string
    startDateTime: Date
    endDateTime: Date
    location: string
    participants: string[]
    skills?: InterviewSkill[]
    comment: string
    candidate: CandidateType
    quizCode: string
}

export type CandidateType = {
    id?: number
    code: string
    accountCode?: string
    email: string
    fullName: string
    imagePath?: string
    avatarColor?: string

    //Audit info
    createDate?: Date
    createdBy?: string
    updateDate?: Date
    updatedBy?: string
}

export type InterviewSkill = {
    id: number
    name: string
    level: 'BEGINNER' | 'CONFIRMED' | 'INTERMEDIATE' | 'EXPERT'
    score: number
    type: 'JOB' | 'RESUME'
}
