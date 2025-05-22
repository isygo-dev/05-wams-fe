import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { useQuery } from 'react-query'
import { statisticJobType } from 'rpm-shared/@core/types/rpm/statisticJobOfferTypes'
import StatisticCard from 'template-shared/views/components/staticCard/CardStatistic'
import JobOfferStatApis from 'rpm-shared/@core/api/rpm/job-offer/statistics'
import { useTranslation } from 'react-i18next'

const StatisticsByJobContainer: React.FC<{ codeJob: string }> = ({ codeJob }) => {
  const { t } = useTranslation()
  const { data: jobStat, isLoading: isLoadingStat } = useQuery<statisticJobType>(['jobStat'], () =>
    JobOfferStatApis(t).getStatisticsByCode(codeJob)
  )

  const { completion, applicationCount, selectedProfilesCount, interviewedProfilesCount, rejectedProfilesCount } =
    jobStat || {}

  return (
    <Card sx={{ height: '100%' }}>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatisticCard
            title='Statistic.Completed'
            value={completion || 0}
            avatarColor='error'
            avatarIcon='tabler:currency-dollar'
            loading={isLoadingStat}
            description={'Statistic.JobOffer_Complete_data'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatisticCard
            title='Statistic.Applications'
            value={applicationCount || 0}
            avatarColor='warning'
            avatarIcon='tabler:upload'
            loading={isLoadingStat}
            description={'Statistic.Applications_Desc'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatisticCard
            title='Statistic.Selected_Profiles'
            value={selectedProfilesCount || 0}
            avatarColor='info'
            avatarIcon='tabler:clipboard-check'
            loading={isLoadingStat}
            description={'Statistic.Selected_Profile_Desc'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatisticCard
            title='Statistic.Interviewed_Profiles'
            value={interviewedProfilesCount || 0}
            avatarColor='success'
            avatarIcon='tabler:clipboard-check'
            loading={isLoadingStat}
            description={'Statistic.Interviewed_Profiles_Dec'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatisticCard
            title='Statistic.Rejected_Profiles'
            value={rejectedProfilesCount || 0}
            avatarColor='error'
            avatarIcon='tabler:message-circle'
            loading={isLoadingStat}
            description={'Statistic.Rejected_Profiles_Desc'}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default StatisticsByJobContainer
