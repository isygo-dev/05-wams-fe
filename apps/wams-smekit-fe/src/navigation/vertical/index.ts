// ** Type import
import {VerticalNavItemsType} from 'template-shared/@core/layouts/types'

const Navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: 'Menu.Dashboard',
      icon: 'tabler:layout-dashboard',
      path: '/apps/dashboard',
    }
  ]
}

export default Navigation
