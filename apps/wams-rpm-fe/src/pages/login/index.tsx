// ** React Imports
import { ReactNode } from 'react'

// ** Icon Imports
// ** Layout Import
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'
import LoginPageViewByEmail from 'template-shared/views/pages/auth/auth-step-login/LoginWithEmail'

const LoginPage = () => {
  return <LoginPageViewByEmail></LoginPageViewByEmail>
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
