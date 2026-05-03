export type JobDetailsType = {
    id: number
    description: string
    experienceMin: number
    experienceMax: number
    responsibility: string[]
    hardSkills: JobSkills[]
    softSkills: JobSkills[]
    jobInfo: JobInfo
    contractInfo: ContractInfo
}

type JobSkills = {
    id: number
    type: string
    name: string
    level: 'beginner' | 'intermediate' | 'confirmed' | 'expert'
    isMandatory?: boolean
}

type JobInfo = {
    id: number
    startDate: Date
    endDate: Date
    deadline: Date
    position: string
    educationLevel: string
    qualifications: string[]
}

type ContractInfo = {
    id: number
    location: string
    salaryMin: number
    salaryMax: number
    workingMode: string
    contract: string
    availability: string
    currency?: string
}
