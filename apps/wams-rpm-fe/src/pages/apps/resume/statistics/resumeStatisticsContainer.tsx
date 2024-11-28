import React from 'react';
import Grid from '@mui/material/Grid';
import {useQuery} from "react-query";
import StatisticCard from "template-shared/views/components/staticCard/CardStatistic";
import ResumeStatApis from "rpm-shared/@core/api/rpm/resume/statistics";
import {useTranslation} from "react-i18next";

enum ResumeStatEnum {
  TOTAL_COUNT = 'TOTAL_COUNT',
  UPLOADED_BY_ME_COUNT = 'UPLOADED_BY_ME_COUNT',
  CONFIRMED_COUNT = 'CONFIRMED_COUNT',
  COMPLETED_COUNT = 'COMPLETED_COUNT',
  INTERVIEWED_COUNT = 'INTERVIEWED_COUNT'
}

const ResumeStatisticsContainer: React.FC = () => {
  const {t} = useTranslation()
  const {
    data: totalCount,
    isLoading: isLoadingTotalCount
  } = useQuery(['totalCount'], () => ResumeStatApis(t).getGlobalStatistics(ResumeStatEnum.TOTAL_COUNT));
  const {
    data: uploadedByMeCount,
    isLoading: isLoadingUploadedByMeCount
  } = useQuery(['uploadedByMeCount'], () => ResumeStatApis(t).getGlobalStatistics(ResumeStatEnum.UPLOADED_BY_ME_COUNT));
  const {
    data: confirmedCount,
    isLoading: isLoadingConfirmedCount
  } = useQuery(['confirmedCount'], () => ResumeStatApis(t).getGlobalStatistics(ResumeStatEnum.CONFIRMED_COUNT));
  const {
    data: completedCount,
    isLoading: isLoadingCompletedCount
  } = useQuery(['completedCount'], () => ResumeStatApis(t).getGlobalStatistics(ResumeStatEnum.COMPLETED_COUNT));
  const {
    data: interviewedCount,
    isLoading: isLoadingInterviewedCount
  } = useQuery(['interviewedCount'], () => ResumeStatApis(t).getGlobalStatistics(ResumeStatEnum.INTERVIEWED_COUNT));

  return (
    <Grid container spacing={2} sx={{mb: 2}}>
      <Grid item xs={12} sm={2.4}>
        <StatisticCard title="Statistic.Resumes"
                       value={totalCount?.totalCount || 0}
                       avatarColor="error"
                       avatarIcon="ph:files-light"
                       loading={isLoadingTotalCount}
                       description={'Statistic.Resume_Desc'}/>
      </Grid>
      <Grid item xs={12} sm={2.4}>
        <StatisticCard title="Statistic.Uploaded_By_Me"
                       value={uploadedByMeCount?.uploadedByMeCount || 0}
                       avatarIcon="mage:television-upload"
                       avatarColor="primary"
                       loading={isLoadingUploadedByMeCount}
                       description={'Statistic.Uploaded_By_Me_Resume_Desc'}/>
      </Grid>
      <Grid item xs={12} sm={2.4}>
        <StatisticCard title="Statistic.Confirmed"
                       value={confirmedCount?.confirmedCount || 0}
                       avatarIcon="iconamoon:file-check-light"
                       avatarColor="primary"
                       loading={isLoadingConfirmedCount}
                       description={'Statistic.Confirmed_Resumes_Desc'}/>
      </Grid>
      <Grid item xs={12} sm={2.4}>
        <StatisticCard title="Statistic.Completed"
                       value={completedCount?.completedCount || 0}
                       avatarIcon="akar-icons:file"
                       avatarColor="primary"
                       loading={isLoadingCompletedCount}
                       description={'Statistic.Completed_Resume_Desc'}/>
      </Grid>
      <Grid item xs={12} sm={2.4}>
        <StatisticCard title="Statistic.Interviewed"
                       value={interviewedCount?.interviewedCount || 0}
                       avatarIcon="fa6-regular:file-video"
                       avatarColor="primary"
                       loading={isLoadingInterviewedCount}
                       description={'Statistic.Interview_Resume_desc'}/>

      </Grid>
    </Grid>
  );
};

export default ResumeStatisticsContainer;
