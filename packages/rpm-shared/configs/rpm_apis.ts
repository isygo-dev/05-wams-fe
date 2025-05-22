import 'dotenv/config' // Import and load dotenv

const api_version = '/api/v1'

let apiUrl_RPM: string | undefined

if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
  apiUrl_RPM = 'https://rpm.dev.wams.isygoit.eu'

  // apiUrl_RPM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/rpm`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
  apiUrl_RPM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/rpm`

  // apiUrl_RPM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/rpm`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
  apiUrl_RPM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/rpm`

  // apiUrl_RPM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/rpm`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
  apiUrl_RPM = 'http://127.0.0.1:40409'

  // apiUrl_RPM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/rpm`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
  apiUrl_RPM = 'https://rpm.dev.wams.isygoit.eu'

  // apiUrl_RPM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/rpm`
} else {
  apiUrl_RPM = 'https://rpm.dev.wams.isygoit.eu'

  // apiUrl_RPM = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/rpm`
}

const rpmApiUrls = {
  apiUrl_RPM,
  apiUrl_RPM_Resume_EndPoint: apiUrl_RPM + api_version + '/private/resume',
  apiUrl_RPM_Resume_ResumeCandidate_EndPoint: apiUrl_RPM + api_version + '/private/resume/candidate',
  apiUrl_RPM_Resume_Count_EndPoint: apiUrl_RPM + api_version + '/private/resume/count',
  apiUrl_RPM_Resume_FileCreate_EndPoint: apiUrl_RPM + api_version + '/private/resume/file',
  apiUrl_RPM_Resume_FileUpdate_EndPoint: apiUrl_RPM + api_version + '/private/resume/file',
  apiUrl_RPM_Resume_FileDownload_EndPoint: apiUrl_RPM + api_version + '/private/resume/file/download',
  apiUrl_RPM_Resume_FileUpload_EndPoint: apiUrl_RPM + api_version + '/private/resume/file/upload',
  apiUrl_RPM_Resume_ShareInfo_EndPoint: apiUrl_RPM + api_version + '/private/resume/share',
  apiUrl_RPM_Resume_MultiFilesDownload_EndPoint: apiUrl_RPM + api_version + '/private/resume/multi-files/download',
  apiUrl_RPM_Resume_MultiFilesUpload_EndPoint: apiUrl_RPM + api_version + '/private/resume/multi-files/upload',
  apiUrl_RPM_Resume_MultiFilesDelete_EndPoint: apiUrl_RPM + api_version + '/private/resume/multi-files',
  apiUrl_RPM_Resume_Review_Update_EndPoint: apiUrl_RPM + api_version + '/private/resume/resume-review/update',
  apiUrl_RPM_Resume_Image_EndPoint: apiUrl_RPM + api_version + '/private/resume/image',
  apiUrl_RPM_Resume_ImageDownload_EndPoint: apiUrl_RPM + api_version + '/private/resume/image/download',
  apiUrl_RPM_Resume_ImageUpload_EndPoint: apiUrl_RPM + api_version + '/private/resume/image/upload',
  apiUrl_RPM_Workflow_EndPoint: apiUrl_RPM + api_version + '/private/workflow',
  apiUrl_RPM_Workflow_Unassociated_EndPoint: apiUrl_RPM + api_version + '/private/workflow/unassociated',
  apiUrl_RPM_JobOffer_EndPoint: apiUrl_RPM + api_version + '/private/JobOffer',
  apiUrl_RPM_JobOffer_Count_EndPoint: apiUrl_RPM + api_version + '/private/JobOffer/count',
  apiUrl_RPM_JobOffer_MultiFilesDownload_EndPoint: apiUrl_RPM + api_version + '/private/JobOffer/multi-files/download',
  apiUrl_RPM_JobOffer_MultiFilesUpload_EndPoint: apiUrl_RPM + api_version + '/private/JobOffer/multi-files/upload',
  apiUrl_RPM_JobOffer_MultiFilesDelete_EndPoint: apiUrl_RPM + api_version + '/private/JobOffer/multi-files',
  apiUrl_RPM_JobOffer_Template_EndPoint: apiUrl_RPM + api_version + '/private/JobOfferTemplate',
  apiUrl_RPM_JobOffer_ShareInfo_EndPoint: apiUrl_RPM + api_version + '/private/JobOffer/share',
  apiUrl_RPM_JobApplication_EndPoint: apiUrl_RPM + api_version + '/private/jobApplication',
  apiUrl_RPM_WorkflowBoard_States_EndPoint: apiUrl_RPM + api_version + '/private/workflow/board/states',
  apiUrl_RPM_WorkflowBoard_EndPoint: apiUrl_RPM + api_version + '/private/workflow/board',
  apiUrl_RPM_WorkflowBoard_Watchers_EndPoint: apiUrl_RPM + api_version + '/private/workflow/board/watchers',
  apiUrl_RPM_WorkflowBoard_Item_EndPoint: apiUrl_RPM + api_version + '/private/workflow/board/event',
  apiUrl_RPM_WorkflowBoard_Event_EndPoint: apiUrl_RPM + api_version + '/private/workflow/board/board-event',
  apiUrl_RPM_WorkflowBoard_Items_EndPoint: apiUrl_RPM + api_version + '/private/workflow/board/items',
  apiUrl_RPM_WorkflowBoard_Candidate_EndPoint: apiUrl_RPM + api_version + '/private/workflow/board/candidate',
  apiUrl_RPM_WorkflowBoard_ItemTypes_EndPoint: apiUrl_RPM + api_version + '/private/workflow/board/itemTypes',
  apiUrl_RPM_TimeLine_EndPoint: apiUrl_RPM + api_version + '/private/timeline',
  apiUrl_RPM_Resume_StatisticGlobal_EndPoint: apiUrl_RPM + api_version + '/private/resume/stat/global',
  apiUrl_RPM_Resume_StatisticObject_EndPoint: apiUrl_RPM + api_version + '/private/resume/stat/object',
  apiUrl_RPM_JobOfferStatisticGlobal_EndPoint: apiUrl_RPM + api_version + '/private/JobOffer/stat/global',
  apiUrl_RPM_JobOfferStatisticObject_EndPoint: apiUrl_RPM + api_version + '/private/JobOffer/stat/object'
}

export default rpmApiUrls
