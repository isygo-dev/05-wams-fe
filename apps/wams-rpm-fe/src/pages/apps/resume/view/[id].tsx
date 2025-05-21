import React from 'react'
import {useRouter} from 'next/router'
import {useMutation, useQuery} from 'react-query'
import {useTranslation} from 'react-i18next'
import Typography from "@mui/material/Typography";
import ResumeApis from "rpm-shared/@core/api/rpm/resume";
import {ResumeTypes} from "rpm-shared/@core/types/rpm/ResumeTypes";
import ViewResumeDrawer from "rpm-shared/@core/components/common-resume-view/list/ViewResumeDrawer";

const ResumeView = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const {id} = router.query

  const updateResumeMutation = useMutation({
    mutationFn: (newMutation: ResumeTypes) => ResumeApis(t).updateResume(newMutation),
    onSuccess: () => {
    }
  })

  const {data: resumeData, isError, isLoading} = useQuery([`resume`, id], () => ResumeApis(t).getResumeById(Number(id)))

  const updateResume = (data: ResumeTypes) => {
    updateResumeMutation.mutate(data)
  }

  if (!resumeData || (isError && !isLoading)) {
    return <div>Resume not found</div>
  }

  return !isLoading && resumeData ? (
    <ViewResumeDrawer resumeDetailsData={resumeData} saveResume={updateResume}/>) : (
    <Typography>There is no data </Typography>
  )
}

export default ResumeView
