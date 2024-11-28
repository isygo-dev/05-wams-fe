// ** Type import
import {VerticalNavItemsType} from 'template-shared/@core/layouts/types'
import {PermissionApplication, PermissionPage} from "template-shared/@core/types/helper/apiPermissionTypes";

const Navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: 'Quiz.Quiz',
      icon: 'material-symbols:quiz-outline',
      path: '/apps/quiz',
      permissionPage: PermissionPage.QUIZ,
      permissionApplication: PermissionApplication.QUIZ
    }
  ]
}

export default Navigation
