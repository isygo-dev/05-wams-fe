import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { useQuery } from 'react-query'
import { statisticEmployeType } from 'hrm-shared/@core/types/hrm/statisticEmployeeType'
import StatisticCard from 'template-shared/views/components/staticCard/CardStatistic'
import EmployeeStatApis from 'hrm-shared/@core/api/hrm/employee/statistics'
import { useTranslation } from 'react-i18next'

const StatisticsByEmployeeContainer: React.FC<{ codeEmployee: string }> = ({ codeEmployee }) => {
  const { t } = useTranslation()
  const { data: employeeStat, isLoading: isLoadingStat } = useQuery<statisticEmployeType>(['employeeStat'], () =>
    EmployeeStatApis(t).getStatisticsByCode(codeEmployee)
  )

  const { contractCount, activeContractAnniversaryDate, activeContractEndDate, nextBonusDate } = employeeStat || {}

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader sx={{ padding: '16px' }} />
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title='Contracts'
            value={contractCount || 0}
            avatarColor='error'
            avatarIcon='tabler:currency-dollar'
            loading={isLoadingStat}
            description={'contract number'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title='Contract.anniversary'
            value={activeContractAnniversaryDate || 0}
            avatarColor='warning'
            avatarIcon='tabler:upload'
            loading={isLoadingStat}
            description={'Anniversary contract'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title='Contract end date'
            value={activeContractEndDate || 0}
            avatarColor='info'
            avatarIcon='tabler:clipboard-check'
            loading={isLoadingStat}
            description={'End date contract'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard
            title='Bonus next date'
            value={nextBonusDate || 0}
            avatarColor='error'
            avatarIcon='tabler:message-circle'
            loading={isLoadingStat}
            description={'next bonus date'}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default StatisticsByEmployeeContainer
