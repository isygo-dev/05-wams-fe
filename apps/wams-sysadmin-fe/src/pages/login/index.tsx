// ** React Imports
import { ReactNode } from 'react'

// ** Layout Import
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'
import LoginPageViewByEmail from 'template-shared/views/pages/auth/auth-step-login/LoginWithEmail'

// ** Styled Components

const LoginPage = () => {
  return <LoginPageViewByEmail></LoginPageViewByEmail>
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
