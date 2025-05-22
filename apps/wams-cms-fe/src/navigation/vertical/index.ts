import { VerticalNavItemsType } from 'template-shared/@core/layouts/types'
import { PermissionApplication, PermissionPage } from 'template-shared/@core/types/helper/apiPermissionTypes'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Calendars',
      icon: 'tabler:calendar',
      path: '/apps/calendars',
      permissionPage: PermissionPage.VCALENDAR,
      permissionApplication: PermissionApplication.CMS
    }
  ]
}

export default navigation
