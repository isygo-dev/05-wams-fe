// ** Types
import {ThemeColor} from '../../layouts/types'
import {AccountDto, MiniAccountChatType} from 'ims-shared/@core/types/ims/accountTypes'

export type StatusType = 'busy' | 'away' | 'online' | 'offline' | 'CONNECTED' | 'DISCONNECTED'

export type StatusObjType = {
    CONNECTED: ThemeColor
    DISCONNECTED: ThemeColor

    // online: ThemeColor
    // offline: ThemeColor
}

export type ProfileUserType = {
    id: number
    role: string
    about: string
    avatar: string
    fullName: string
    status: StatusType
    settings: {
        isNotificationsOn: boolean
        isTwoStepAuthVerificationEnabled: boolean
    }
}

export type MsgFeedbackType = {
    isSent: boolean
    isSeen: boolean
    isDelivered: boolean
}

export type ChatType = {
    message: string
    senderId: number
    time: Date | string
    feedback: MsgFeedbackType
}

export type ChatsObj = {
    id: number
    userId: number
    chat: ChatType[]
    unseenMsgs: number
    lastMessage?: ChatType
}

export type ContactType = {
    id: number
    role: string
    about: string
    avatar?: string
    fullName: string
    status: StatusType
    avatarColor?: ThemeColor
}

export type ChatsArrType = {
    id: number
    role: string
    about: string
    chat: ChatsObj
    avatar?: string
    fullName: string
    status: StatusType
    avatarColor?: ThemeColor
}

export type SelectedChatType = null | {
    chat: ChatsObj
    contact: ChatsArrType
}

export type ChatStoreType = {
    chats: ChatsArrType[] | null
    contacts: ContactType[] | null
    userProfile: ProfileUserType | null
    selectedChat: SelectedChatType
}

export type SendMsgParamsType = {
    chat?: ChatsObj
    message: string
    contact?: ChatsArrType
}

export type ChatContentType = {
    hidden: boolean
    mdAbove: boolean

    sidebarWidth: number
    statusObj: StatusObjType
    userProfileRightOpen: boolean
    handleLeftSidebarToggle: () => void
    getInitials: (val: string) => string
    handleUserProfileRightSidebarToggle: () => void
    showChat: boolean
    setShowChat: (showChat: boolean) => void
    user: AccountDto
    contact: MiniAccountChatType
    conversationList: ChatMessagesType[]
    newMessageTest: ChatMessagesType
    sendSuccess: boolean
    setSendSuccess: (item: boolean) => void
    setConversationList: (data: ChatMessagesType[]) => void
    publishMessage: (sendMessage: ChatMessagesType) => void
}

export type ChatSidebarLeftType = {
    hidden: boolean

    sidebarWidth: number
    userStatus: StatusType
    leftSidebarOpen: boolean
    statusObj: StatusObjType
    userProfileLeftOpen: boolean
    handleLeftSidebarToggle: () => void
    getInitials: (val: string) => string

    // setUserStatus: (status: StatusType) => void
    handleUserProfileLeftSidebarToggle: () => void
    formatDateToMonthShort: (value: string, toTimeForCurrentDay: boolean) => void
    showChat: boolean
    setShowChat: (showChat: boolean) => void
    handleLeftSidebarShow: () => void
    user: AccountDto
    contactsAccount: MiniAccountChatType[]
    handelCheckImagePath: (userId: number) => boolean
    setSelectChatId: (id: number) => void
    handelGetNewConversation: (id: number) => void
    chatAccountList: ChatAccountDto[]
}

export type UserProfileLeftType = {
    hidden: boolean
    store: ChatStoreType
    sidebarWidth: number
    userStatus: StatusType
    statusObj: StatusObjType
    userProfileLeftOpen: boolean
    setUserStatus: (status: StatusType) => void
    handleUserProfileLeftSidebarToggle: () => void
}

export type UserProfileRightType = {
    hidden: boolean
    store: ChatStoreType
    sidebarWidth: number
    statusObj: StatusObjType
    userProfileRightOpen: boolean
    getInitials: (val: string) => string
    handleUserProfileRightSidebarToggle: () => void
}

export type SendMsgComponentType = {
    setNewMessage: (msg: string) => void
}

export type ChatLogType = {
    hidden: boolean
    data: {
        chat: ChatsObj
        contact: ContactType
        userContact: ProfileUserType
    }
}

export type MessageType = {
    time: string | Date
    message: string
    senderId: number
    feedback: MsgFeedbackType
}

export type ChatLogChatType = {
    msg: string
    time: string | Date
    feedback?: MsgFeedbackType
}

export type FormattedChatsType = {
    senderId: number
    messages: ChatLogChatType[]
}

export type MessageGroupType = {
    senderId: number
    messages: ChatLogChatType[]
}

export type ChatAccountDto = {
    id?: number
    receiverId: number
    senderId: number
    fromFullName?: string
    lastMessage: string
    date: Date | string
    read: boolean
    imagePath?: boolean
    status?: AccountChatStatus
    colorStatus?: string
}

export enum AccountChatStatus {
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    STATUS = 'STATUS'
}

export type SelectedChatAccountProps = {
    hidden: boolean
    chat: ChatMessagesType[]
    contact: MiniAccountChatType
    userContact: AccountDto
}

export type ChatMessagesType = {
    id?: number
    receiverId: number
    senderId: number
    message: string
    date: Date
    read: boolean
}

export type SendMessageWebSocketType = {
    type: MessageTypeEnum
    destination: MessageDestinationEnum
    sentFromId: number
    sentFrom: string
    message: string
}

export enum MessageTypeEnum {
    NOTIFICATION = 'NOTIFICATION',
    CHAT = 'CHAT',
    LOGIN_PERMISSION = 'LOGIN_PERMISSION',
    FREE = 'FREE'
}

export enum MessageDestinationEnum {
    USER = 'USER',
    GROUP = 'GROUP',
    ALL = 'ALL'
}
