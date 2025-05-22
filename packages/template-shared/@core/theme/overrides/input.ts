// ** Type Import
import { OwnerStateThemeType } from './index'

const input = () => {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.secondary
        })
      }
    },
    MuiInput: {
      styleOverrides: {
        root: () => ({
          '&:before': {
            borderBottom: `1px solid rgba(51, 48, 60, 0.22)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(51, 48, 60, 0.32)`
          },
          '&.Mui-disabled:before': {
            borderBottomStyle: 'solid'
          }
        })
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: () => ({
          backgroundColor: `rgba(51, 48, 60, 0.04)`,
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: `rgba(51, 48, 60, 0.08)`
          },
          '&:before': {
            borderBottom: `1px solid rgba(51, 48, 60, 0.22)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(51, 48, 60, 0.32)`
          }
        })
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '&:hover:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: `rgba(51, 48, 60, 0.32)`
          },
          '&:hover.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: `rgba(51, 48, 60, 0.22)`
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.disabled
          },
          '&.Mui-focused': {
            boxShadow: `0 2px 3px 0 rgba(51, 48, 60, 0.1)`
          }
        })
      }
    }
  }
}

export default input
