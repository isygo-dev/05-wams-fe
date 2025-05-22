import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import EditWorkflow from '../../../../views/apps/workFlow/view/EditWorkflow'
import WorkflowApis from 'rpm-shared/@core/api/rpm/workflow'
import { useTranslation } from 'react-i18next'

const WorkFlowView = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const { data: workFlowDetailsData, isLoading } = useQuery([`workflow`, id], () =>
    WorkflowApis(t).getWorkflowById(id?.toString())
  )

  return !isLoading && <EditWorkflow workFlowDetailsData={workFlowDetailsData} />
}

export default WorkFlowView
