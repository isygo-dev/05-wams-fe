export type ResumeProfExperience = {
    id?: number
    jobTitle: string
    employer: string
    city: string
    country: string
    startDate: Date
    endDate: Date
    workhere: boolean
    description: string
    technology?: string[]


    disabledWorkhere?: boolean
}

export type ResumeEducation = {
    id: number
    institution: string
    city: string
    country: string
    qualification: string
    fieldOfStudy: string
    yearOfGraduation: Date
}

export type Skill = {
    id: number
    name: string
    level: 'beginner' | 'intermediate' | 'confirmed' | 'expert'
    score: number
}

export type ResumeCertification = {
    id?: number
    name: string
    dateOfObtained: Date
    link: string
}

export type ResumeLanguage = {
    id: number
    name: string
    level: 'beginner' | 'intermediate' | 'good' | 'alright' | 'fluent'
}

export type ResumeDetails = {
    id: number
    profExperiences: ResumeProfExperience[]
    educations: ResumeEducation[]
    skills: Skill[]
    certifications: ResumeCertification[]
    languages: ResumeLanguage[]
}
