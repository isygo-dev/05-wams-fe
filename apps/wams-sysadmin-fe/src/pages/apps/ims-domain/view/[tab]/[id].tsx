import React from 'react'
import {useRouter} from 'next/router'
import DomainView from '../../../../../views/apps/domain/DomainView'
import {useQuery} from 'react-query'
import DomainApis from "ims-shared/@core/api/ims/domain";
import {useTranslation} from "react-i18next";

const CustomerDetailView = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const {id} = router.query
  const {
    data: domainDetail,
    isError,
    isLoading
  } = useQuery(['domainDetail', id], () => DomainApis(t).getDomainById(Number(id)), {})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !domainDetail) {
    return <div>Error loading account data</div>
  }

  return <DomainView domainDetail={domainDetail}/>
}

export default CustomerDetailView
