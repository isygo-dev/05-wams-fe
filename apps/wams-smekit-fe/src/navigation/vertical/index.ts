// ** Type import
import {VerticalNavItemsType} from 'template-shared/@core/layouts/types'
import {t} from "i18next";

const Navigation = (): VerticalNavItemsType => {

  return [
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: t('Dashboard'),
      icon: 'tabler:home',
      path: '/apps/dashboard',
    },
    {
      title: t('fav'),
      icon: 'tabler:home',
      path: '/apps/CustomTemplates',
    },
    {
      sectionTitle: 'Content Management'
    },
    {
      title: t('Categories'),
      icon: 'tabler:category',
      path: '/apps/category',
    },
    {
      title: t('Authors'),
      icon: 'tabler:users',
      path: '/apps/author',
    },
    {
      title: t('Templates'),
      icon: 'tabler:template',
      path: '/apps/template',
    }
  ]
}

export default Navigation
