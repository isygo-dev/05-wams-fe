// ** React Imports
import { ReactNode } from 'react'
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'
import ResetPasswordView from 'template-shared/views/pages/auth/reset-password/ResetPasswordView'

const ResetPasswordPage = () => {
  return <ResetPasswordView></ResetPasswordView>
}

ResetPasswordPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ResetPasswordPage.guestGuard = true

export default ResetPasswordPage
