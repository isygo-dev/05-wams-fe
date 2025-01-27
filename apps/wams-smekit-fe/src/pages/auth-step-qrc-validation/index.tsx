// ** React Imports
import {ReactNode} from 'react'
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'
import QrcStepView from 'template-shared/views/pages/auth/auth-step-qrc-validation/QrcStepView'

const QrcStep = () => {
  return (
    <>
      <QrcStepView></QrcStepView>
    </>
  )
}

QrcStep.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

QrcStep.guestGuard = true

export default QrcStep
