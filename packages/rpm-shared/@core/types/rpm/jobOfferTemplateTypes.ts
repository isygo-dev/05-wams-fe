import { JobOfferType } from './jobOfferTypes'

export type JobTemplate = {
  id?: number
  tenant: string
  title: string
  jobOffer: JobOfferType
}
