import {WorkflowsType} from './workflowTypes'

export type WorkflowsBoardType = {
    id: number
    domain: string
    code: string
    name: string
    description: string
    item: string
    workflow: WorkflowsType
    boardId: number
    watchers: string[]

    //Audit info
    createDate?: Date
    createdBy?: string
    updateDate?: Date
    updatedBy?: string
}

export type WorkflowsBoardData = {
    domain: string
    name: string
    description: string
    item: string
    workflow: WorkflowsType | string
    watchers: string[]
}


export type WorkFlowBoardType = {
    id: number
    createDate: string
    createdBy: string
    updateDate: string
    updatedBy: string
    domain: string
    code: string
    name: string
    description: string
    item: string
    workflow: Workflow
    watchers: string[]
    icon?: string
}

export type Workflow = {
    id: number
    createDate: string
    createdBy: string
    updateDate: string
    updatedBy: string
    domain: string
    code: string
    name: string
    description: string
    category: string
    type: string
    workflowStates: WorkflowState[]
    workflowTransitions: WorkflowTransition[]
}

export type WorkflowState = {
    id: number
    createDate: string
    createdBy: string
    updateDate: string
    updatedBy: string
    name: string
    code: string
    wbCode: any
    description: string
    sequence: number
    color?: string
    positionType: string
}

export type WorkflowTransition = {
    id: number
    createDate: string
    createdBy: string
    updateDate: string
    updatedBy: string
    code: string
    fromCode: string
    toCode: string
    transitionService: string
    notify: boolean
    bidirectional: boolean
    watchers: string[]
    itemTypes: any[]
}
