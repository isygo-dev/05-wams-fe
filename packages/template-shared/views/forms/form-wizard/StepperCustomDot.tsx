// ** MUI Imports
import MuiBox, { BoxProps } from '@mui/material/Box'
import { StepIconProps } from '@mui/material/StepIcon'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Icon Import
import Icon from 'template-shared/@core/components/icon'

// ** Hooks Imports
import useBgColor, { UseBgColorType } from 'template-shared/@core/hooks/useBgColor'

// Styled Box component
const Box = styled(MuiBox)<BoxProps>(() => ({
  width: 20,
  height: 20,
  borderWidth: 3,
  borderRadius: '50%',
  borderStyle: 'solid'
}))

const StepperCustomDot = (props: StepIconProps) => {
  // ** Props
  const { active, completed, error } = props

  // ** Hooks
  const theme = useTheme()
  const bgColors: UseBgColorType = useBgColor()

  if (error) {
    return <Icon icon='tabler:alert-triangle' fontSize={20} color={theme.palette.error.main} transform='scale(1.2)' />
  } else if (completed) {
    return <Icon icon='tabler:circle-check' fontSize={20} color={theme.palette.primary.main} transform='scale(1.2)' />
  } else {
    return (
      <Box
        sx={{
          borderColor: bgColors.primaryLight.backgroundColor,
          ...(active && {
            borderWidth: 5,
            borderColor: 'primary.main',
            backgroundColor: theme.palette.mode === 'light' ? 'common.white' : 'background.default'
          })
        }}
      />
    )
  }
}

export default StepperCustomDot
