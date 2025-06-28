import {VerticalNavItemsType} from 'template-shared/@core/layouts/types'
import {t} from "i18next";

const Navigation = (): VerticalNavItemsType => {



  return [
    {
      sectionTitle: t('Apps & Pages'),
    },
    {
      title: t('Dashboard'),
      icon: 'tabler:layout-dashboard',
      path: '/apps/dashboard',
    },
    {
      title: t('Pinned Templates'),
      icon: 'tabler:bookmark',
      path: '/apps/CustomTemplates',
    },

    {
      sectionTitle: t('Content Management'),
    },
    {
      title: t('Categories'),
      icon: 'tabler:grid-dots',
      path: '/apps/category',
    },
    {
      title: t('doc'),
      icon: 'tabler:grid-dots',
      path: '/apps/DocumentsPartages',
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
    },
    {
      title: t('Document'),
      icon: 'tabler:file-text',
      path: '/apps/document',
    },
  ]}

export default Navigation
