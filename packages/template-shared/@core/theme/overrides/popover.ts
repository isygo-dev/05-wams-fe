// ** Type Imports
import { OwnerStateThemeType } from './index'
import { Skin } from 'template-shared/@core/layouts/types'

const Popover = (skin: Skin) => {
  return {
    MuiPopover: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '& .MuiPopover-paper': {
            boxShadow: theme.shadows[skin === 'bordered' ? 0 : 6],
            ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
          }
        })
      }
    }
  }
}

export default Popover
