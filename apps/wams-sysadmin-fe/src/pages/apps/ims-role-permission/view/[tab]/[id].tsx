import RoleView from '../../../../../views/apps/role-permission/RoleView'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import React from 'react'
import RolePermissionApis from 'ims-shared/@core/api/ims/role-permission'
import ApplicationApis from 'ims-shared/@core/api/ims/application'
import { useTranslation } from 'react-i18next'

const RoleViewdetail = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const {
    data: roleDetailsData,
    isError,
    isLoading
  } = useQuery(['roleDetailsData', id], () => RolePermissionApis(t).getRoleById(Number(id)), {})

  const {
    data: applicationList,
    isLoading: isLoadingRole,
    isError: isErrorRole
  } = useQuery(`applications`, () => ApplicationApis(t).getApplicationsOfDefaultDomain())

  if (isLoading && isLoadingRole) {
    return <div>Loading...</div>
  }

  if (isError || !roleDetailsData || isErrorRole) {
    return <div>Error loading role data</div>
  }

  return (
    <>{roleDetailsData ? <RoleView applicationList={applicationList} roleDetailsData={roleDetailsData} /> : null}</>
  )
}

export default RoleViewdetail
