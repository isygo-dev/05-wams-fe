// ** React Imports
import {ReactNode} from 'react'
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'
import OtpView from "template-shared/views/pages/auth/auth-step-otp-validation/OtpView";

const TwoSteps = () => {

  return (
    <OtpView></OtpView>
  )
}

TwoSteps.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

TwoSteps.guestGuard = true

export default TwoSteps
