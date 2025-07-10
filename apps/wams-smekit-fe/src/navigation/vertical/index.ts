import {VerticalNavItemsType} from 'template-shared/@core/layouts/types'
import {t} from "i18next";
import {PermissionApplication, PermissionPage} from "template-shared/@core/types/helper/apiPermissionTypes";

const Navigation = (): VerticalNavItemsType => {



  return [
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: t('Dashboard'),
      icon: 'tabler:layout-dashboard',
      path: '/apps/dashboard',
      permissionPage: PermissionPage.DHASHBOARD,
      permissionApplication: PermissionApplication.SMEKIT
    },


    {
      sectionTitle: t('Content Management'),
    },
    {
      title: t('Pinned Templates'),
      icon: 'tabler:bookmark',
      path: '/apps/CustomTemplates',

    },
    {
      title: t('Categories'),
      icon: 'tabler:grid-dots',
      path: '/apps/category',
      permissionPage: PermissionPage.CATEGORY,
      permissionApplication: PermissionApplication.SMEKIT
    },
    // {
    //   title: t('doc'),
    //   icon: 'tabler:grid-dots',
    //   path: '/apps/DocumentsPartages',
    //   permissionPage: PermissionPage.DOCUMENT,
    //   permissionApplication: PermissionApplication.SMEKIT
    // },
    {
      title: t('Authors'),
      icon: 'tabler:users',
      path: '/apps/author',
      permissionPage: PermissionPage.AUTHOR,
      permissionApplication: PermissionApplication.SMEKIT
    },
    {
      title: t('Templates'),
      icon: 'tabler:template',
      path: '/apps/template',
      permissionPage: PermissionPage.TEMPLATE,
      permissionApplication: PermissionApplication.SMEKIT
    },
    {
      title: t('Document'),
      icon: 'tabler:file-text',
      path: '/apps/document',
      permissionPage: PermissionPage.DOCUMENT,
      permissionApplication: PermissionApplication.SMEKIT
    },
  ]}

export default Navigation
