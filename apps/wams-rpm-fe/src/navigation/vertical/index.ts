// ** Type import
import {VerticalNavItemsType} from 'template-shared/@core/layouts/types'
import {PermissionApplication, PermissionPage} from "template-shared/@core/types/helper/apiPermissionTypes";

const navigation = (): VerticalNavItemsType => {

  return [
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: 'Menu.Resumes',
      icon: 'fluent:document-ribbon-16-regular',
      path: '/apps/resume',
      permissionPage: PermissionPage.RESUME,
      permissionApplication: PermissionApplication.RPM
    },
    {
      title: 'Menu.Jobs',
      icon: 'fluent-mdl2:recruitment-management',
      path: '/apps/jobOffer',
      permissionPage: PermissionPage.JOB_OFFER,
      permissionApplication: PermissionApplication.RPM
    },
    {
      title: 'Menu.Dashboard',
      icon: 'tabler:layout-dashboard',
      permissionSection: 'NavSectionTitle',
      children: [

        {
          title: 'Menu.Workflows',
          icon: 'carbon:workflow-automation',
          path: '/apps/workflow',
          permissionPage: PermissionPage.WORKFLOW,
          permissionApplication: PermissionApplication.RPM
        },
        {
          title: 'Menu.Workflow-boards',
          icon: 'tabler:layout-board-split',
          path: '/apps/workflow-board',
          permissionPage: PermissionPage.WORKFLOW_BOARD,
          permissionApplication: PermissionApplication.RPM
        },
        {
          title: 'Menu.Boards',
          icon: 'tabler:layout-dashboard',
          path: '/apps/dashboard',
          permissionPage: PermissionPage.WORKFLOW_BOARD,
          permissionApplication: PermissionApplication.RPM
        }
      ]
    }
  ]
}

export default navigation
