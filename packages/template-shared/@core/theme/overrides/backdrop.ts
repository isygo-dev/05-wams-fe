// ** Type Import
import { OwnerStateThemeType } from './index'

// ** Util Import
import { hexToRGBA } from 'template-shared/@core/utils/hex-to-rgba'

const Backdrop = () => {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          backgroundColor:
            theme.palette.mode === 'light' ? `rgba(51, 48, 60, 0.7)` : hexToRGBA(theme.palette.background.default, 0.7)
        }),
        invisible: {
          backgroundColor: 'transparent'
        }
      }
    }
  }
}

export default Backdrop
