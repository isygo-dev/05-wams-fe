// ResumeStatisticsContainer.tsx
import React from 'react'

import Grid from '@mui/material/Grid'
import { useQuery } from 'react-query'
import StatisticCard from 'template-shared/views/components/staticCard/CardStatistic'
import JobOfferStatApis from 'rpm-shared/@core/api/rpm/job-offer/statistics'
import { useTranslation } from 'react-i18next'

enum JobStatEnum {
  TOTAL_COUNT = 'TOTAL_COUNT',
  ACTIVE_COUNT = 'ACTIVE_COUNT',
  CONFIRMED_COUNT = 'CONFIRMED_COUNT',
  EXPIRED_COUNT = 'EXPIRED_COUNT'
}

const JobOfferStatisticsContainer: React.FC = () => {
  const { t } = useTranslation()
  const { data: totalCount, isLoading: isLoadingTotalCount } = useQuery(['totalCount'], () =>
    JobOfferStatApis(t).getGlobalStatistics(JobStatEnum.TOTAL_COUNT)
  )
  const { data: activeCount, isLoading: isLoadingActiveCount } = useQuery(['activeCount'], () =>
    JobOfferStatApis(t).getGlobalStatistics(JobStatEnum.ACTIVE_COUNT)
  )
  const { data: confirmedCount, isLoading: isLoadingConfirmedCount } = useQuery(['confirmedCount'], () =>
    JobOfferStatApis(t).getGlobalStatistics(JobStatEnum.CONFIRMED_COUNT)
  )
  const { data: expiredCount, isLoading: isLoadingExpiredCount } = useQuery(['confirmedCount'], () =>
    JobOfferStatApis(t).getGlobalStatistics(JobStatEnum.EXPIRED_COUNT)
  )

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={3}>
        <StatisticCard
          title='Statistic.JobOffers'
          value={totalCount?.totalCount || 0}
          avatarColor='primary'
          avatarIcon='uis:bag'
          loading={isLoadingTotalCount}
          description={'Statistic.JobOffers_desc'}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <StatisticCard
          title='Statistic.Active'
          description={'Statistic.Active_JobOffers_Desc'}
          value={activeCount?.activeCount || 0}
          avatarColor='primary'
          avatarIcon='bi:bag-check'
          loading={isLoadingActiveCount}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <StatisticCard
          title='Statistic.Done'
          description={'Statistic.Done_Desc'}
          value={confirmedCount?.confirmedCount || 0}
          avatarColor='primary'
          avatarIcon='bi:bag-heart'
          loading={isLoadingConfirmedCount}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <StatisticCard
          title='Statistic.Expired'
          description={'Statistic.Expired_JobOffer_Desc'}
          value={expiredCount?.expiredCount || 0}
          avatarColor='primary'
          avatarIcon='uil:bag-slash'
          loading={isLoadingExpiredCount}
        />
      </Grid>
    </Grid>
  )
}

export default JobOfferStatisticsContainer
