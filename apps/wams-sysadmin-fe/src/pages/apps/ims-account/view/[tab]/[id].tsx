import AccountSettings from 'template-shared/views/pages/account-settings/AccountSettings'
import { useRouter } from 'next/router'
import React from 'react'

const AccountView = () => {
  const router = useRouter()
  const { id } = router.query

  return <AccountSettings tab='account' id={Number(id)} />
}

export default AccountView
