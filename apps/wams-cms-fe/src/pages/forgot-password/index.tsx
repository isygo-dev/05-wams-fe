// ** React Imports
import {ReactNode} from 'react'
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'
import ForgotPasswordView from "template-shared/views/pages/auth/forgot-password/ForgotPassword";

const ForgotPassword = () => {

  return (
    <ForgotPasswordView></ForgotPasswordView>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPassword.guestGuard = true

export default ForgotPassword
