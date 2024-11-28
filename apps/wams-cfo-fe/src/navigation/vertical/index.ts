// ** Type import
import {VerticalNavItemsType} from 'template-shared/@core/layouts/types'
import {PermissionApplication, PermissionPage} from "template-shared/@core/types/helper/apiPermissionTypes";

const Navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: 'Resume.Resume',
      icon: 'fluent:document-ribbon-16-regular',
      path: '/apps/resume',
      permissionPage: PermissionPage.RESUME,
      permissionApplication: PermissionApplication.RPM
    },
    {
      title: 'Job.Job',
      icon: 'fluent-mdl2:recruitment-management',
      path: '/apps/jobOffer/',
      permissionPage: PermissionPage.JOB_OFFER,
      permissionApplication: PermissionApplication.RPM
    },
    {
      title: 'Quiz.Quiz',
      icon: 'material-symbols:quiz-outline',
      path: '/apps/quiz/',
      permissionPage: PermissionPage.CANDIDATE_QUIZ,
      permissionApplication: PermissionApplication.QUIZ
    }
  ]
}

export default Navigation
