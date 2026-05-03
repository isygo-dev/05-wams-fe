// ** Types
import {ThemeColor} from '../../layouts/types'

export type UsersType = {
    id: number
    role: string
    email: string
    status: string
    avatar: string
    billing: string
    company: string
    country: string
    contact: string
    fullName: string
    username: string
    currentPlan: string
    avatarColor?: ThemeColor
}

export type ProjectListDataType = {
    id: number
    img: string
    hours: string
    totalTask: string
    projectType: string
    projectTitle: string
    progressValue: number
    progressColor: ThemeColor
}

export type RequestStatus = {
    id: number
    newReqStatus: string
}

export type RequestIsAdmin = {
    id: number
    newStatus: boolean
}
