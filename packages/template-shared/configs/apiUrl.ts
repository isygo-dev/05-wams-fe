import 'dotenv/config' // Import and load dotenv

const api_version = '/api/v1'
let apiUrl_GATEWAY: string | undefined
let apiUrl_CMS: string | undefined
let apiUrl_SCUI: string | undefined

//let apiUrl_LMS: string | undefined
//let apiUrl_PMS: string | undefined

if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
  apiUrl_GATEWAY = 'https://gateway.dev.wams.isygoit.eu'
  apiUrl_CMS = 'https://cms.dev.wams.isygoit.eu'
  apiUrl_SCUI = 'https://ai.smartcode.isygoit.eu'

  // apiUrl_LMS = 'https://lms.dev.wams.isygoit.eu'
  // apiUrl_PMS = 'https://pms.dev.wams.isygoit.eu'
  // apiUrl_GATEWAY = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}`
  // apiUrl_CMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/cms`
  // apiUrl_SCUI = 'https://ai.smartcode.isygoit.eu'
  // apiUrl_LMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/lms`
  // apiUrl_PMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/pms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
  apiUrl_GATEWAY = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}`
  apiUrl_CMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/cms`
  apiUrl_SCUI = 'https://ai.smartcode.isygoit.eu'

  // apiUrl_LMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/lms`
  // apiUrl_PMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/pms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
  apiUrl_GATEWAY = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}`
  apiUrl_CMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/cms`
  apiUrl_SCUI = 'https://ai.smartcode.isygoit.eu'

  // apiUrl_LMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/lms`
  // apiUrl_PMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/pms`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
  apiUrl_GATEWAY = 'http://127.0.0.1:8060'
  apiUrl_CMS = 'http://127.0.0.1:40407'
  apiUrl_SCUI = 'https://ai.smartcode.isygoit.eu'

  // apiUrl_LMS = 'http://127.0.0.1:40410'
  // apiUrl_PMS = 'http://127.0.0.1:40411'
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
  apiUrl_GATEWAY = 'https://gateway.dev.wams.isygoit.eu'
  apiUrl_CMS = 'https://cms.dev.wams.isygoit.eu'
  apiUrl_SCUI = 'http://127.0.0.1:5000'

  // apiUrl_LMS = 'http://127.0.0.1:40410'
  // apiUrl_PMS = 'http://127.0.0.1:40411'

  // apiUrl_GATEWAY = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}`
  // apiUrl_DMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/dms`
  // apiUrl_CMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/cms`
  // apiUrl_SCUI = 'http://127.0.0.1:5000'
  // apiUrl_LMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/lms`
  // apiUrl_PMS = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/pms`
} else {
  apiUrl_GATEWAY = 'https://gateway.dev.wams.isygoit.eu'
  apiUrl_CMS = 'https://cms.dev.wams.isygoit.eu'
  apiUrl_SCUI = 'https://ai.smartcode.isygoit.eu'

  // apiUrl_LMS = 'https://lms.dev.wams.isygoit.eu'
  // apiUrl_PMS = 'https://pms.dev.wams.isygoit.eu'
}

const apiUrls = {
  apiUrl_GATEWAY,

  //===========================================================================
  apiUrl_CMS,
  apiUrl_CMS_Calendar_EndPoint: apiUrl_CMS + api_version + '/private/calendar',
  apiUrl_CMS_Calendar_Count_EndPoint: apiUrl_CMS + api_version + '/private/calendar/count',
  apiUrl_CMS_Calendar_Download_EndPoint: apiUrl_CMS + api_version + '/private/calendar/ics/download',
  apiUrl_CMS_Calendar_Event_EndPoint: apiUrl_CMS + api_version + '/private/calendar/event',
  apiUrl_CMS_Calendar_EventByDomainAndCalendarName_EndPoint:
    apiUrl_CMS + api_version + '/private/calendar/event/byDomainAndCalendarName',
  apiUrl_CMS_UpdateLockedCalendar_EndPoint: apiUrl_CMS + api_version + '/private/calendar/locked-status',

  apiUrl_SCUI,
  apiUrl_SCUI_UserStory_EndPoint: apiUrl_SCUI + '/create',
  apiUrl_SCUI_DeleteUserStory_EndPoint: apiUrl_SCUI + '/deleteUserStory',
  apiUrl_SCUI_AiJob_EndPoint: apiUrl_SCUI + '/getAllProjects',
  apiUrl_SCUI_AiJobGetDetails_EndPoint: apiUrl_SCUI + '/getProject',
  apiUrl_SCUI_CreateAIJob_EndPoint: apiUrl_SCUI + '/createProject',
  apiUrl_SCUI_GetDataBase_EndPoint: apiUrl_SCUI + '/getDBSchemas',
  apiUrl_SCUI_GetJsonSchema_EndPoint: apiUrl_SCUI + '/json-schemas',
  apiUrl_SCUI_GetXmlSchema_EndPoint: apiUrl_SCUI + '/xml-schemas',
  apiUrl_SCUI_AiJobDelete_EndPoint: apiUrl_SCUI + '/deleteProject',
  apiUrl_SCUI_AiJobGetRelatedUserStory_EndPoint: apiUrl_SCUI + '/getUserStoriesByProjectId',
  apiUrl_SCUI_UserStory_Create_EndPoint: apiUrl_SCUI + '/create',
  apiUrl_SCUI_UserStoriesCreate_EndPoint: apiUrl_SCUI + '/createBatch',
  apiUrl_SCUI_SetLanguage_EndPoint: apiUrl_SCUI + '/set_language',
  apiUrl_SCUI_UserStory_GetValidationParams_EndPoint: apiUrl_SCUI + '/validations',
  apiUrl_SCUI_UserStory_GetValidationFunction_EndPoint: apiUrl_SCUI + '/validations',
  apiUrl_SCUI_UserStory_Validate_EndPoint: apiUrl_SCUI + '/validates',
  apiUrl_SCUI_UserStory_RemoveParams_EndPoint: apiUrl_SCUI + '/remove',
  apiUrl_SCUI_UserStory_GetSummary_EndPoint: apiUrl_SCUI + '/get',
  apiUrl_SCUI_UserStory_GenerateCodes_EndPoint: apiUrl_SCUI + '/code_generate/',
  apiUrl_SCUI_GetProjectHierarchy_EndPoint: apiUrl_SCUI + '/get_project_hierarchy/',
  apiUrl_SCUI_UserStory_GetAllUserStoriesMin_EndPoint: apiUrl_SCUI + '/getUserStoriesMinByProjectId',
  apiUrl_SCUI_UserStory_RemoveFunction_EndPoint: apiUrl_SCUI + '/remove',
  apiUrl_SCUI_UserStory_DownloadCodeFile_EndPoint: apiUrl_SCUI + '',
  apiUrl_SCUI_UserStory_GetProjectDetails_EndPoint: apiUrl_SCUI + '/getProject/',
  apiUrl_SCUI_DependenciesList_EndPoint: apiUrl_SCUI + '/getDependencies',
  apiUrl_SCUI_CreateSpringBoot_EndPoint: apiUrl_SCUI + '/createSpringBootProject',
  apiUrl_SCUI_CompileSpringBoot_EndPoint: apiUrl_SCUI + '/compileSpringAppJar/',
  apiUrl_SCUI_AIProjectFramework_EndPoint: apiUrl_SCUI + '/languages'
}

export default apiUrls
