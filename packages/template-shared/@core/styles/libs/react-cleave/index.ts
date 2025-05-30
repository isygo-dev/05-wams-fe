// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

const CleaveWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  '& input': {
    height: 56,
    fontSize: 16,
    width: '100%',
    borderWidth: 1,
    background: 'none',
    borderStyle: 'solid',
    padding: '16.5px 14px',
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    fontFamily: theme.typography.body1.fontFamily,
    borderColor: `rgba(51, 48, 60, 0.22)`,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus, &:focus-visible': {
      outline: 0,
      borderWidth: 2,
      padding: '15.5px 13px',
      borderColor: `${theme.palette.primary.main} !important`,
      boxShadow: `0 2px 3px 0 rgba(51, 48, 60, 0.1)`
    },
    '&::-webkit-input-placeholder': {
      color: theme.palette.text.secondary
    }
  }
}))

export default CleaveWrapper
