export type StateType = {
    id?: number
    code?: string
    wbCode?: string;
    name: string
    description: string
    sequence: number
    color?: string
    positionType: WorkflowStateSwitch
}

export enum WorkflowStateSwitch {
    INIT = 'INIT',
    INTER = 'INTER',
    FINAL = 'FINAL',
}
