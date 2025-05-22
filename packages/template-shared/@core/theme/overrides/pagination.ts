// ** Type Import
import { OwnerStateThemeType } from './index'

// ** Util Import
import { hexToRGBA } from 'template-shared/@core/utils/hex-to-rgba'

const Pagination = () => {
  return {
    MuiPaginationItem: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '&:not(.MuiPaginationItem-outlined):not(.Mui-disabled)': {
            transition: theme.transitions.create(['color', 'background-color', 'box-shadow'], {
              duration: 250,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }),
            '&.Mui-selected': {
              boxShadow: theme.shadows[2]
            }
          }
        }),
        outlined: () => ({
          borderColor: `rgba(51, 48, 60, 0.22)`
        }),
        outlinedPrimary: ({ theme }: OwnerStateThemeType) => ({
          '&.Mui-selected': {
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.16)
          }
        }),
        outlinedSecondary: ({ theme }: OwnerStateThemeType) => ({
          '&.Mui-selected': {
            backgroundColor: hexToRGBA(theme.palette.secondary.main, 0.16)
          }
        })
      }
    }
  }
}

export default Pagination
