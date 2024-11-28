import React, {createContext, useState} from 'react'
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'
import {FormProvider, useForm} from 'react-hook-form'
import {ContractType} from 'hrm-shared/@core/types/hrm/contractType'
import ViewContractDrawer from '../../../../views/apps/contract/ViewContractDrawer'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {checkPermission} from "template-shared/@core/api/helper/permission";
import {useTranslation} from "react-i18next";
import ContractApis from "hrm-shared/@core/api/hrm/contract";

export const ContractContext = createContext(null)

const ContractView = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const {id} = router.query

  const {
    data: contractData,
    isError,
    isLoading,
    refetch
  } = useQuery<ContractType>(['contractData', id], () => ContractApis(t).getContractById(id), {
    onSuccess: data => {
      updateContractData(data)
    }
  })

  const [contextData, setContextData] = useState<ContractType>(contractData)
  const methods = useForm()
  const updateContractData = (newData: ContractType) => {
    setContextData(newData)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !contractData) {
    return <div>Error loading contract data</div>
  }

  return (checkPermission(PermissionApplication.HRM, PermissionPage.CONTRACT, PermissionAction.READ) &&
    <ContractContext.Provider value={{contractData: contextData, updateContractData}}>
      <FormProvider {...methods}>
        <ViewContractDrawer refetch={refetch}/>
      </FormProvider>
    </ContractContext.Provider>
  )
}

export default ContractView
