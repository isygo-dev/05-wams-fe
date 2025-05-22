// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icons Imports
// ** Styled Component
import DatePickerWrapper from 'template-shared/@core/styles/libs/react-datepicker'
import IconButton from '@mui/material/IconButton'
import { useMutation } from 'react-query'
import Icon from 'template-shared/@core/components/icon'
import React from 'react'
import CalendarApis from 'cms-shared/@core/api/cms/calendar'
import { useTranslation } from 'react-i18next'
import { SidebarCalLeftType } from 'template-shared/@core/types/helper/calendarTypes'

const SidebarLeft = (props: SidebarCalLeftType) => {
  const { t } = useTranslation()
  const {
    mdAbove,
    calendarApi,
    leftSidebarOpen,
    leftSidebarWidth,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
    domain,
    name,
    lock
  } = props

  const handleSidebarToggleSidebar = () => {
    handleAddEventSidebarToggle()

    // dispatch(handleSelectEvent(null))
  }

  const mutationDownload = useMutation({
    mutationFn: () => CalendarApis(t).downloadCalendarIcsFile(domain, name),
    onSuccess: () => {},
    onError: err => {
      console.log(err)
    }
  })

  const handlerToggelDownload = () => {
    mutationDownload.mutate()
  }

  return (
    <Drawer
      open={leftSidebarOpen}
      onClose={handleLeftSidebarToggle}
      variant={mdAbove ? 'permanent' : 'temporary'}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true,
        keepMounted: true // Better open performance on mobile.
      }}
      sx={{
        zIndex: 2,
        display: 'block',
        position: mdAbove ? 'static' : 'absolute',
        '& .MuiDrawer-paper': {
          borderRadius: 1,
          boxShadow: 'none',
          width: leftSidebarWidth,
          borderTopRightRadius: 0,
          alignItems: 'flex-start',
          borderBottomRightRadius: 0,
          zIndex: mdAbove ? 2 : 'drawer',
          position: mdAbove ? 'static' : 'absolute'
        },
        '& .MuiBackdrop-root': {
          borderRadius: 1,
          position: 'absolute'
        }
      }}
    >
      <Box sx={{ p: 6, width: '100%' }} className='d-flex-row'>
        <div>
          <IconButton aria-label='capture screenshot' onClick={lock ? undefined : handleSidebarToggleSidebar}>
            <Icon icon='ic:baseline-add-box' />
          </IconButton>
          <IconButton aria-label='capture screenshot'>
            {lock ? <Icon icon='material-symbols:lock' /> : <Icon icon={'tabler:x'} color={'primary'} />}
          </IconButton>
          <IconButton aria-label='capture screenshot' onClick={handlerToggelDownload}>
            <Icon icon='ic:baseline-file-download' />
          </IconButton>
        </div>
      </Box>

      <Divider sx={{ width: '100%', m: '0 !important' }} />
      <DatePickerWrapper
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          '& .react-datepicker': { boxShadow: 'none !important', border: 'none !important' }
        }}
      >
        <DatePicker inline onChange={date => calendarApi.gotoDate(date)} />
      </DatePickerWrapper>
      <Divider sx={{ width: '100%', m: '0 !important' }} />
    </Drawer>
  )
}

export default SidebarLeft
