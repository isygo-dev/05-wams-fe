import {JobOfferType} from './jobOfferTypes'

export type JobTemplate = {
    id?: number
    domain: string
    title: string
    jobOffer: JobOfferType
}
