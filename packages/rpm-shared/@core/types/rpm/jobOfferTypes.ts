import {JobDetailsType} from './jobOfferDetailsTypes'
import {AdditionalFiles} from "template-shared/@core/types/helper/fileTypes";

export type JobOfferType = {
    id: number
    code: string
    title: string
    owner: string
    domain: string
    department: string
    industry: string
    employerType: string
    jobFunction: string
    customer: string
    jobShareInfos: JobShareInfo[]
    details: JobDetailsType
    additionalFiles: AdditionalFiles[]

    //Audit info
    createDate?: Date
    createdBy?: string
    updateDate?: Date
    updatedBy?: string
}

export type JobShareInfo = {
    id: number
    sharedWith: string
    rate: number
    comment: string
}
