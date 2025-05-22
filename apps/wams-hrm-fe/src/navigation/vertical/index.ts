import { VerticalNavItemsType } from 'template-shared/@core/layouts/types'
import { PermissionApplication, PermissionPage } from 'template-shared/@core/types/helper/apiPermissionTypes'

const Navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: 'Employee.Employee',
      icon: 'clarity:employee-group-line',
      path: '/apps/employee',
      permissionPage: PermissionPage.EMPLOYEE,
      permissionApplication: PermissionApplication.HRM
    },
    {
      title: 'Contract.contract',
      icon: 'icon-park-outline:agreement',
      path: '/apps/contract',
      permissionPage: PermissionPage.CONTRACT,
      permissionApplication: PermissionApplication.HRM
    },
    {
      title: 'LeaveStatus.LeaveStatus',
      icon: 'material-symbols:travel-luggage-and-bags-outline',
      path: '/apps/leaveStatus',
      permissionPage: PermissionPage.CONTRACT,
      permissionApplication: PermissionApplication.HRM
    }
  ]
}

export default Navigation
