import React from 'react'
import {useRouter} from 'next/router'
import FlowView from '../../../../../views/apps/integration-flow/view/FlowView'
import {useQuery} from "react-query";
import IntegrationFlowApis from "integration-shared/@core/api/integration/flow";
import {useTranslation} from "react-i18next";

const FlowDetailView = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const {id} = router.query
  const {
    data: flowData,
    isLoading,
    isError
  } = useQuery(`flowData`, () => id && IntegrationFlowApis(t).getIntegrationFlowById(Number(id)))

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !flowData) {
    return <div>Error loading account data</div>
  }

  return <FlowView flowData={flowData}/>
}

export default FlowDetailView
