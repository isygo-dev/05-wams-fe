import {HorizontalNavItemsType} from 'template-shared/@core/layouts/types'
import {PermissionApplication, PermissionPage} from 'template-shared/@core/types/helper/apiPermissionTypes';

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'System',
      icon: 'grommet-icons:system',
      permissionSection: 'NavSectionTitle',
      children: [
        {
          icon: 'grommet-icons:user',
          title: 'Account.Account',
          path: '/apps/ims-account',
          permissionPage: PermissionPage.ACCOUNT,
          permissionApplication: PermissionApplication.IMS
        },
        {
          icon: 'carbon:customer',
          title: 'Customer.Customer',
          path: '/apps/ims-customer',
          permissionPage: PermissionPage.CUSTOMER,
          permissionApplication: PermissionApplication.IMS
        },
        {
          icon: 'gridicons:domains',
          title: 'Domain.Domain',
          path: '/apps/ims-domain',
          permissionPage: PermissionPage.DOMAIN,
          permissionApplication: PermissionApplication.IMS
        },
        {
          icon: 'streamline:application-add',
          title: 'Application.Application',
          path: '/apps/ims-application',
          permissionPage: PermissionPage.APPLICATION,
          permissionApplication: PermissionApplication.IMS
        },
        {
          icon: 'eos-icons:role-binding-outlined',
          title: 'Role.Role',
          path: '/apps/ims-role-permission',
          permissionPage: PermissionPage.ROLE_INFO,
          permissionApplication: PermissionApplication.IMS
        },
        {
          icon: 'material-symbols:inbox-customize-outline',
          title: 'Parameter.Parameter',
          path: '/apps/ims-custom-parameter',
          permissionPage: PermissionPage.APP_PARAMETER,
          permissionApplication: PermissionApplication.IMS
        },

        {
          icon: 'fluent:table-copy-20-filled',
          title: 'Annex.Annex',
          path: '/apps/ims-annex',
          permissionPage: PermissionPage.ANNEX,
          permissionApplication: PermissionApplication.IMS
        }
      ]
    },
    {
      title: 'Security.Security',
      icon: 'mdi:security-lock-outline',
      permissionSection: 'NavSectionTitle',
      children: [
        {
          icon: 'solar:password-linear',
          title: 'Password.Password',
          path: '/apps/kms-password-config',
          permissionPage: PermissionPage.PASSWORD_CONFIG,
          permissionApplication: PermissionApplication.KMS
        },
        {
          icon: 'mdi:encryption-check-outline',
          title: 'PEB.PEB',
          path: '/apps/kms-peb-config',
          permissionPage: PermissionPage.PEB_CONFIG,
          permissionApplication: PermissionApplication.KMS
        },
        {
          icon: 'mdi:encryption-alert-outline',
          title: 'Digest.Digest',
          path: '/apps/kms-digest-config',
          permissionPage: PermissionPage.DIGETS_CONFIG,
          permissionApplication: PermissionApplication.KMS
        },
        {
          icon: 'ri:token-swap-line',
          title: 'Codification.Codification',
          path: '/apps/kms-next-code',
          permissionPage: PermissionPage.APP_NEXT_CODE,
          permissionApplication: PermissionApplication.KMS
        },
        {
          icon: 'ri:token-swap-line',
          title: 'Token.Token',
          path: '/apps/kms-token-config',
          permissionPage: PermissionPage.TOKEN_CONFIG,
          permissionApplication: PermissionApplication.KMS
        }
      ]
    },
    {
      title: 'Storage.Storage',
      icon: 'oui:storage',
      permissionSection: 'NavSectionTitle',
      children: [
        {
          icon: 'file-icons:config',
          title: 'Storage.Config',
          path: '/apps/sms-storage-config',
          permissionPage: PermissionPage.STORAGE_CONFIG,
          permissionApplication: PermissionApplication.SMS
        }
      ]
    },
    {
      title: 'Messaging',
      icon: 'eva:message-square-outline',
      permissionSection: 'NavSectionTitle',
      children: [
        {
          icon: 'fluent:mail-template-20-regular',
          title: 'Template.Template',
          path: '/apps/mms-mail-template',
          permissionPage: PermissionPage.MSG_TEMPLATE,
          permissionApplication: PermissionApplication.MMS
        },
        {
          icon: 'file-icons:config',
          title: 'Config.Config',
          path: '/apps/mms-mail-sender-config',
          permissionPage: PermissionPage.SENDER_CONFIG,
          permissionApplication: PermissionApplication.MMS
        }
      ]
    }
  ]
}

export default navigation
