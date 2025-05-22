// ** Type Import
import { OwnerStateThemeType } from './index'

// ** Util Import
import { hexToRGBA } from 'template-shared/@core/utils/hex-to-rgba'

const Tooltip = () => {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }: OwnerStateThemeType) => ({
          backgroundColor: theme.palette.mode === 'light' ? `rgba(51, 48, 60, 0.9)` : hexToRGBA('#F1F0F2', 0.9)
        }),
        arrow: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.mode === 'light' ? `rgba(51, 48, 60, 0.9)` : hexToRGBA('#F1F0F2', 0.9)
        })
      }
    }
  }
}

export default Tooltip
