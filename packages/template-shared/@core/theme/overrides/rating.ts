// ** Type Import
import { OwnerStateThemeType } from './index'

const Rating = () => {
  return {
    MuiRating: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.warning.main,
          '& svg': {
            flexShrink: 0
          }
        })
      }
    }
  }
}

export default Rating
