// ** React Imports
// ** Redux Imports

// ** MUI Imports

// ** Hooks

// ** Types
import { MailLabelColors, MailLayoutType } from 'template-shared/@core/types/helper/emailTypes'

// ** Email App Component Imports

// ** Actions

// ** Variables
const labelColors: MailLabelColors = {
  private: 'error',
  personal: 'success',
  company: 'primary',
  important: 'warning'
}

const EmailAppLayout = ({ folder, label }: MailLayoutType) => {
  /*
     // ** States
     const [query, setQuery] = useState<string>('')
     const [composeOpen, setComposeOpen] = useState<boolean>(false)
     const [mailDetailsOpen, setMailDetailsOpen] = useState<boolean>(false)
     const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)

     // ** Hooks
     const theme = useTheme()
     const {settings} = useSettings()
     const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
     const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
     const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
     const hidden = useMediaQuery(theme.breakpoints.down('lg'))

     // ** Vars
     const leftSidebarWidth = 260
     const {skin, direction} = settings
     const composePopupWidth = mdAbove ? 754 : smAbove ? 520 : '100%'
     const routeParams = {
       label: label || '',
       folder: folder || 'inbox'
     }

     const toggleComposeOpen = () => setComposeOpen(!composeOpen)
     const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

     return (
       <Box
         sx={{
           width: '100%',
           display: 'flex',
           borderRadius: 1,
           overflow: 'hidden',
           position: 'relative',
           boxShadow: skin === 'bordered' ? 0 : 6,
           ...(skin === 'bordered' && {border: `1px solid ${theme.palette.divider}`})
         }}
       >
         <SidebarLeft
           store={store}
           hidden={hidden}
           lgAbove={lgAbove}
           dispatch={dispatch}
           mailDetailsOpen={mailDetailsOpen}
           leftSidebarOpen={leftSidebarOpen}
           leftSidebarWidth={leftSidebarWidth}
           toggleComposeOpen={toggleComposeOpen}
           setMailDetailsOpen={setMailDetailsOpen}
           handleSelectAllMail={handleSelectAllMail}
           handleLeftSidebarToggle={handleLeftSidebarToggle}
         />
         <MailLog
           query={query}
           store={store}
           hidden={hidden}
           lgAbove={lgAbove}
           dispatch={dispatch}
           setQuery={setQuery}
           direction={direction}
           updateMail={updateMail}
           routeParams={routeParams}
           labelColors={labelColors}
           paginateMail={paginateMail}
           getCurrentMail={getCurrentMail}
           updateMailLabel={updateMailLabel}
           mailDetailsOpen={mailDetailsOpen}
           handleSelectMail={handleSelectMail}
           setMailDetailsOpen={setMailDetailsOpen}
           handleSelectAllMail={handleSelectAllMail}
           handleLeftSidebarToggle={handleLeftSidebarToggle}
         />
         <ComposePopup
           mdAbove={mdAbove}
           composeOpen={composeOpen}
           composePopupWidth={composePopupWidth}
           toggleComposeOpen={toggleComposeOpen}
         />
       </Box>
     )*/
}

export default EmailAppLayout
