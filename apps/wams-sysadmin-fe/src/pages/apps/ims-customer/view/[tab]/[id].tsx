import React from 'react'
import {useRouter} from 'next/router'
import CustomerView from '../../../../../views/apps/customer/CustomerView'
import {useQuery} from "react-query";
import CustomerApis from "ims-shared/@core/api/ims/customer";
import {useTranslation} from "react-i18next";

const CustomerDetailView = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const {id} = router.query
  const {
    data: customerData,
    isLoading,
    isError
  } = useQuery(`customerData`, () => id && CustomerApis(t).getCustomerDetails(Number(id)))

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !customerData) {
    return <div>Error loading account data</div>
  }

  return <CustomerView customerData={customerData}/>
}

export default CustomerDetailView
