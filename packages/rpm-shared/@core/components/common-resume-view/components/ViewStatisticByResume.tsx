import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { useQuery } from 'react-query'
import { statisticResumeType } from 'rpm-shared/@core/types/rpm/statisticResumeTypes'
import StatisticCard from 'template-shared/views/components/staticCard/CardStatistic'
import ResumeStatApis from 'rpm-shared/@core/api/rpm/resume/statistics'
import { useTranslation } from 'react-i18next'

const StatisticsByResumeContainer: React.FC<{ codeCandidat: string }> = ({ codeCandidat }) => {
  const { t } = useTranslation()
  const { data: resumeStat, isLoading: isLoadingStat } = useQuery<statisticResumeType>(['resumeStat'], () =>
    ResumeStatApis(t).getStatisticsByCode(codeCandidat)
  )

  const { completion, realizedTestsCount, applicationsCount, ongoingApplicationsCount } = resumeStat || {}

  return (
    <Card sx={{ height: '100%' }}>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title='Statistic.Completion'
            value={completion || 0}
            avatarColor='error'
            avatarIcon='tabler:currency-dollar'
            loading={isLoadingStat}
            description={'Statistic.Completion_Description'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title='Statistic.Tests_Realized'
            value={realizedTestsCount || 0}
            avatarColor='warning'
            avatarIcon='tabler:upload'
            loading={isLoadingStat}
            description={'Statistic.Tests_Realized_Description'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title='Statistic.Offers_Applied'
            value={applicationsCount || 0}
            avatarColor='info'
            avatarIcon='tabler:clipboard-check'
            loading={isLoadingStat}
            description={'Statistic.Offers_Applied_Description'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title='Statistic.Ongoing_Applications'
            value={ongoingApplicationsCount || 0}
            avatarColor='error'
            avatarIcon='tabler:message-circle'
            loading={isLoadingStat}
            description={'Statistic.Ongoing_Applications_Description'}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default StatisticsByResumeContainer
