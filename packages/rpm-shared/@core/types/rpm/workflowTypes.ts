import { StateType } from './stateTypes'
import { TransitionType } from './transitionTypes'

export type WorkflowsType = {
  id: number
  tenant: string
  code: string
  name: string
  category: string
  description: string
  type: string
  workflowStates: StateType[]
  workflowTransitions: TransitionType[]

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type WorkflowData = {
  tenant: string
  name: string
  category: string
  description: string
  type: string
}

export type AvailableEmailsRequest = {
  tenant: string
  wfCode: string
}
