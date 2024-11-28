import {AddressTypes} from './addressTypes'
import {AdminStatus} from "./accountTypes";


export type CustomerDetailType = {
    id?: number
    name: string
    description?: string
    imagePath?: string
    url?: string
    email?: string
    phoneNumber?: string
    domain: string
    accountCode?: string
    createDate?: Date
    updateDate?: Date
    createdBy?: string
    updatedBy?: string
    adminStatus: AdminStatus
    address?: AddressTypes
}
