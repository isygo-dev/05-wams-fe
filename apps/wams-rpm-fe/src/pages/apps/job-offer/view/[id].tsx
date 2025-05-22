import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import JobOfferApis from 'rpm-shared/@core/api/rpm/job-offer'
import ViewJobOfferDrawer from 'rpm-shared/views/apps/job-offer/ViewJobOfferDrawer'

const JobView = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query

  const {
    data: jobData,
    isError,
    isLoading
  } = useQuery(['jobData', id], () => JobOfferApis(t).getJobOfferById(Number(id)), {})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !jobData) {
    return <div>Error loading job data</div>
  }

  return <ViewJobOfferDrawer jobDetailsData={jobData} />
}

export default JobView
