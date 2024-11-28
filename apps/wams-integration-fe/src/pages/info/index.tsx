// ** React Imports
import React, {ReactNode} from 'react'

// ** Layout Import
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'
import InfoView from 'template-shared/views/pages/info/InfoView'


const EmailSent = () => {
  return (<InfoView></InfoView>)
}

EmailSent.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
EmailSent.guestGuard = true

export default EmailSent
