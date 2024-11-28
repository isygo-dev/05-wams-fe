import React from 'react'
import {useMutation, useQuery} from 'react-query'
import {useAuth} from 'template-shared/hooks/useAuth'
import {useTranslation} from 'react-i18next'
import ResumeApis from "rpm-shared/@core/api/rpm/resume";
import ViewResumeDrawer from "template-shared/@core/components/common-resume-view/list/ViewResumeDrawer";
import {AddressTypes} from "ims-shared/@core/types/ims/addressTypes";
import {ResumeDetails} from "rpm-shared/@core/types/rpm/ResumeDetails";
import {ResumeTypes} from "rpm-shared/@core/types/rpm/ResumeTypes";

const ResumeViewCfo = () => {
  const {t} = useTranslation()
  const authUser = useAuth().user
  const defaultResume: ResumeTypes = {
    birthDate: null,
    details: {} as ResumeDetails,
    domain: '',
    email: authUser?.email || '',
    address: {} as AddressTypes,
    extension: '',
    file: undefined,
    title: '',
    firstName: authUser?.firstName || '',
    lastName: authUser?.lastName || '',
    nationality: '',
    originalFileName: '',
    id: null,
    phone: '',
    imagePath: '',
    resumeShareInfos: [],
    additionalFiles: [],
    tags: [],
    version: 0
  }

  const {data: resumeData, isLoading, isError} = useQuery('resumeData', () => ResumeApis(t).getResumeByCandidate())
  window.localStorage.setItem('resumeCode', resumeData ? resumeData.code : '')
  const addResumeMutation = useMutation({
    mutationFn: (data: ResumeTypes) => ResumeApis(t).addResumeCandidate(data),
    onSuccess: (res: ResumeTypes) => {
      console.log(res)
    }
  })

  const addResumeCandidate = data => {
    addResumeMutation.mutate(data)
  }

  const updateResumeMutation = useMutation({
    mutationFn: (newMutation: ResumeTypes) => ResumeApis(t).updateResume(newMutation),
    onSuccess: () => {
    }
  })

  const updateResume = (data: ResumeTypes) => {
    updateResumeMutation.mutate(data)
  }

  console.log('auth.user', authUser)
  console.log('resumeData', resumeData)
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !resumeData || Object.keys(resumeData).length === 0) {
    return (
      <div>
        {isError ? (
          <div>Resume not found</div>
        ) : (
          <ViewResumeDrawer resumeDetailsData={defaultResume} saveResume={addResumeCandidate}/>
        )}
      </div>
    )
  }

  return (
    <div>
      <ViewResumeDrawer resumeDetailsData={resumeData} saveResume={updateResume}/>
    </div>
  )
}

export default ResumeViewCfo
