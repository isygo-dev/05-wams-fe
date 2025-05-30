// ** Type Import
import { OwnerStateThemeType } from './index'

const Table = () => {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          boxShadow: theme.shadows[0],
          borderTopColor: theme.palette.divider
        })
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          '& .MuiTableCell-head': {
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '1px'
          }
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '& .MuiTableCell-body': {
            letterSpacing: '0.25px',
            color: theme.palette.text.secondary,
            '&:not(.MuiTableCell-sizeSmall):not(.MuiTableCell-paddingCheckbox):not(.MuiTableCell-paddingNone)': {
              paddingTop: theme.spacing(3.5),
              paddingBottom: theme.spacing(3.5)
            }
          }
        })
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '& .MuiTableCell-head:not(.MuiTableCell-paddingCheckbox):first-of-type, & .MuiTableCell-root:not(.MuiTableCell-paddingCheckbox):first-child ':
            {
              paddingLeft: theme.spacing(6)
            },
          '& .MuiTableCell-head:last-child, & .MuiTableCell-root:last-child': {
            paddingRight: theme.spacing(6)
          }
        })
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          borderBottom: `1px solid ${theme.palette.divider}`
        }),
        paddingCheckbox: ({ theme }: OwnerStateThemeType) => ({
          paddingLeft: theme.spacing(3.25)
        }),
        stickyHeader: () => ({
          backgroundColor: '#F6F6F7'
        })
      }
    }
  }
}

export default Table
