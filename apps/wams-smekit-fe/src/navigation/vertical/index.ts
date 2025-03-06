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
    ,
    {
      title: 'Menu.Template',
      icon: 'tabler:layout-dashboard',
      path: '/apps/template',
    } ,
    {
      title: 'Menu.Category',
      icon: 'tabler:layout-dashboard',
      path: '/apps/category',
    },
    {
      title: 'Menu.Author',
      icon: 'tabler:layout-dashboard',
      path: '/apps/author',
    }
  ]
}

export default Navigation
