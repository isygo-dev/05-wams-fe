import React from 'react';
import Grid from '@mui/material/Grid';
import {useQuery} from "react-query";
import StatisticCard from "template-shared/views/components/staticCard/CardStatistic";
import EmployeeStatApis from "hrm-shared/@core/api/hrm/employee/statistics";
import {useTranslation} from "react-i18next";

enum EmployeeStatEnum {
  TOTAL_COUNT = 'TOTAL_COUNT',
  ACTIVE_COUNT = 'ACTIVE_COUNT',
  CONFIRMED_COUNT = 'CONFIRMED_COUNT',
}

const EmployeeStatisticsContainer: React.FC = () => {
  const {t} = useTranslation()
  const {
    data: totalCount,
    isLoading: isLoadingTotalCount
  } = useQuery(['totalCount'], () => EmployeeStatApis(t).getGlobalStatistics(EmployeeStatEnum.TOTAL_COUNT));
  const {
    data: activeCount,
    isLoading: isLoadingActiveCount
  } = useQuery(['activeCount'], () => EmployeeStatApis(t).getGlobalStatistics(EmployeeStatEnum.ACTIVE_COUNT));
  const {
    data: confirmedCount,
    isLoading: isLoadingConfirmedCount
  } = useQuery(['confirmedCount'], () => EmployeeStatApis(t).getGlobalStatistics(EmployeeStatEnum.CONFIRMED_COUNT));

  return (
    <Grid container spacing={2} sx={{mb: 2}}>
      <Grid item xs={12} sm={3}>
        <StatisticCard title="Statistic.Employees"
                       value={totalCount?.totalCount || 0}
                       avatarColor="primary"
                       avatarIcon="clarity:employee-group-line"
                       loading={isLoadingTotalCount}
                       description={'Statistic.Employees_Desc'}/>
      </Grid>
      <Grid item xs={12} sm={3}>
        <StatisticCard title="Statistic.Active"
                       description={'Statistic.Active_Employees_Desc'}
                       value={activeCount?.activeCount || 0}
                       avatarColor="primary"
                       avatarIcon="tabler:user-bolt"
                       loading={isLoadingActiveCount}/>
      </Grid>
      <Grid item xs={12} sm={3}>
        <StatisticCard title="Statistic.Confirmed"
                       description={'Statistic.Confirmed_Desc'}
                       value={confirmedCount?.confirmedCount || 0}
                       avatarColor="primary"
                       avatarIcon="tabler:user-check"
                       loading={isLoadingConfirmedCount}/>
      </Grid>
      <Grid item xs={12} sm={3}>
        <StatisticCard title="Statistic.Done"
                       description={'Statistic.Done_Desc'}
                       value={confirmedCount?.confirmedCount || 0}
                       avatarColor="primary"
                       avatarIcon="tabler:user-check"
                       loading={isLoadingConfirmedCount}/>
      </Grid>
    </Grid>
  );
};

export default EmployeeStatisticsContainer;
