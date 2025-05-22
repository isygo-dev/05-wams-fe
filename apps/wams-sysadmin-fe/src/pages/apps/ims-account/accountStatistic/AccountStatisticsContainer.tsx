// ResumeStatisticsContainer.tsx
import React from 'react'

import Grid from '@mui/material/Grid'
import { useQuery } from 'react-query'

import AccountStatApis from 'ims-shared/@core/api/ims/account/statistics'
import StatisticCard from 'template-shared/views/components/staticCard/CardStatistic'
import { useTranslation } from 'react-i18next'

enum AccountStatEnum {
  TOTAL_COUNT = 'TOTAL_COUNT',
  ACTIVE_COUNT = 'ACTIVE_COUNT',
  CONFIRMED_COUNT = 'CONFIRMED_COUNT',
  ADMINS_COUNT = 'ADMINS_COUNT'
}

const AccountStatisticsContainer: React.FC = () => {
  const { t } = useTranslation()
  const { data: totalCount, isLoading: isLoadingTotalCount } = useQuery(['totalCount'], () =>
    AccountStatApis(t).getGlobalStatistics(AccountStatEnum.TOTAL_COUNT)
  )
  const { data: activeCount, isLoading: isLoadingActiveCount } = useQuery(['activeCount'], () =>
    AccountStatApis(t).getGlobalStatistics(AccountStatEnum.ACTIVE_COUNT)
  )
  const { data: confirmedCount, isLoading: isLoadingConfirmedCount } = useQuery(['confirmedCount'], () =>
    AccountStatApis(t).getGlobalStatistics(AccountStatEnum.CONFIRMED_COUNT)
  )
  const { data: adminsCount, isLoading: isLoadingAdminsCount } = useQuery(['adminsCount'], () =>
    AccountStatApis(t).getGlobalStatistics(AccountStatEnum.ADMINS_COUNT)
  )

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={3}>
        <StatisticCard
          title='Statistic.Accounts'
          value={totalCount?.totalCount || 0}
          avatarColor='primary'
          avatarIcon='tabler:users-group'
          loading={isLoadingTotalCount}
          description={'Statistic.Accounts_desc'}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <StatisticCard
          title='Statistic.Active'
          value={activeCount?.activeCount || 0}
          avatarColor='primary'
          avatarIcon='tabler:user-bolt'
          loading={isLoadingActiveCount}
          description={'Statistic.Active_Accounts_Desc'}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <StatisticCard
          title='Statistic.Confirmed'
          value={confirmedCount?.confirmedCount || 0}
          avatarColor='primary'
          avatarIcon='tabler:user-check'
          loading={isLoadingConfirmedCount}
          description={'Statistic.Confirmed_Accounts_Desc'}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <StatisticCard
          title='Statistic.Administrators'
          value={adminsCount?.adminsCount || 0}
          avatarColor='primary'
          avatarIcon='tabler:user-star'
          loading={isLoadingAdminsCount}
          description={'Statistic.Admins_Accounts_Desc'}
        />
      </Grid>
    </Grid>
  )
}

export default AccountStatisticsContainer
