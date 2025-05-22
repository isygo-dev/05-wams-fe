// ** React Imports
import React, { ReactNode } from 'react'

// ** Layout Import
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'

import AuthStepRegister from 'template-shared/views/pages/auth/auth-step-regiter'

const Register = () => {
  return <AuthStepRegister />
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
