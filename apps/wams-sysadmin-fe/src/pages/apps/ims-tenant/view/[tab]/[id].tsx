import React from 'react'
import { useRouter } from 'next/router'
import TenantView from '../../../../../views/apps/tenant/TenantView'
import { useQuery } from 'react-query'
import TenantApis from '../../../../../../../../packages/ims-shared/@core/api/ims/tenant'
import { useTranslation } from 'react-i18next'

const CustomerDetailView = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const {
    data: tenantDetail,
    isError,
    isLoading
  } = useQuery(['tenantDetail', id], () => TenantApis(t).getTenantById(Number(id)), {})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !tenantDetail) {
    return <div>Error loading account data</div>
  }

  return <TenantView tenantDetail={tenantDetail} />
}

export default CustomerDetailView
