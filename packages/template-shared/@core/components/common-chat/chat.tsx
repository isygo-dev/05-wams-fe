import {useEffect, useState} from 'react'
import Box from '@mui/material/Box'
import {useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
    AccountChatStatus,
    ChatAccountDto,
    ChatMessagesType,
    StatusObjType,
    StatusType
} from 'template-shared/@core/types/chat/chatTypes'
import {useSettings} from '../../hooks/useSettings'
import SidebarLeft from '../../../views/apps/chat/SidebarLeft'
import ChatContent from '../../../views/apps/chat/ChatContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Icon from '../icon'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {AccountDto, MiniAccountChatType} from 'ims-shared/@core/types/ims/accountTypes'
import SockJs from 'sockjs-client'
import {over} from 'stompjs'
import mmsApiUrls from "mms-shared/configs/mms_apis";
import localStorageKeys from '../../../configs/localeStorage'
import {UserDataType} from '../../../context/types'
import AccountApis from 'ims-shared/@core/api/ims/account'
import {useTranslation} from 'react-i18next'
import {formatDateToMonthShort} from '../../utils/format'
import {getInitials} from '../../utils/get-initials'
import ChatAccountApis from 'mms-shared/@core/api/mms/chat'

// ** Types

type ChatProps = {
    user: AccountDto
}

const AppChat = (props: ChatProps) => {
    const {t} = useTranslation()
    const {user} = props
    const [userStatus] = useState<StatusType>('CONNECTED')
    const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
    const [userProfileLeftOpen, setUserProfileLeftOpen] = useState<boolean>(false)
    const [userProfileRightOpen, setUserProfileRightOpen] = useState<boolean>(false)
    const [stompClient, setStompClient] = useState<any>()
    const [isConnected, setIsConnected] = useState<boolean>()
    const [showChat, setShowChat] = useState<boolean>(false)
    const [sideBarChatOpen, setSideBarChatOpen] = useState<boolean>(false)
    const [selectChatId, setSelectChatId] = useState<number>()
    const [conversationList, setConversationList] = useState<ChatMessagesType[]>([])
    const [newMessageTest, setNewMessageTest] = useState<ChatMessagesType>()
    const [sendSuccess, setSendSuccess] = useState<boolean>(false)
    const queryClient = useQueryClient()
    const {data: contactsAccount, isLoading} = useQuery(`contactsAccount`, AccountApis(t).getAccountsSessionStatus)
    const {data: chatAccountList, isLoading: isLoadingChatAccountList} = useQuery(
        `chatAccountList`,
        () => user.id && ChatAccountApis(t).getChatsAccounts(user.id)
    )

    const theme = useTheme()
    const {settings} = useSettings()
    const hidden = useMediaQuery(theme.breakpoints.down('lg'))
    const {skin} = settings
    const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
    const sidebarWidth = smAbove ? 360 : 360
    const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
    const statusObj: StatusObjType = {
        CONNECTED: 'success',
        DISCONNECTED: 'secondary'
    }
    const userData: UserDataType = JSON.parse(localStorage.getItem(localStorageKeys.userData) || '{}')
    const handelCheckImagePath = (userId: number) => {
        const profile: MiniAccountChatType = contactsAccount?.find(d => d.id === userId)
        if (profile?.imagePath && profile?.imagePath !== 'defaultPhoto.jpg') {
            return true
        } else {
            return false
        }
    }

    const addNewAccountChat = (data: ChatMessagesType, cachedChatAccountList: ChatAccountDto[]) => {
        let updateStatusChat: AccountChatStatus
        if (data.senderId === user.id) {
            const lastConvStatus = contactsAccount?.find(f => f.id === data.receiverId)
            updateStatusChat = lastConvStatus.status
        } else {
            updateStatusChat = AccountChatStatus.CONNECTED
        }

        const newAccountChat: ChatAccountDto = {
            senderId: data.senderId,
            receiverId: data.receiverId,
            lastMessage: data.message,
            date: data.date,
            read: data.read,
            status: updateStatusChat
        }
        const newItems = [...cachedChatAccountList]
        newItems.unshift(newAccountChat)
        queryClient.setQueryData('chatAccountList', newItems)
    }
    const updateLastConversationChat = (data: ChatMessagesType, cachedChatAccountList: ChatAccountDto[]) => {
        const indexConv = cachedChatAccountList?.findIndex(
            d => d.senderId === data.senderId || d.receiverId === data.senderId
        )

        let lastConvStatus: AccountChatStatus
        if (data.senderId === user.id) {
            const lastConv = cachedChatAccountList?.find(
                d => d.receiverId === data.receiverId || d.senderId === data.receiverId
            )
            lastConvStatus = lastConv.status
        } else {
            const lastConv = cachedChatAccountList?.find(d => d.receiverId === data.senderId || d.senderId === data.senderId)
            lastConvStatus = lastConv.status
        }
        const newItems = cachedChatAccountList?.filter((f, i) => i !== indexConv)
        const newAccountChat: ChatAccountDto = {
            senderId: data.senderId,
            receiverId: data.receiverId,
            lastMessage: data.message,
            date: data.date,
            read: data.read,
            status: lastConvStatus
        }

        newItems.unshift(newAccountChat)
        queryClient.setQueryData('chatAccountList', newItems)
    }
    const handleChangeLastMsgConversation = (data: ChatMessagesType) => {
        const cachedChatAccountList: ChatAccountDto[] = queryClient.getQueryData('chatAccountList') || []
        if (data.senderId !== user.id) {
            const checkConversation: ChatAccountDto = cachedChatAccountList?.find(
                d => d.senderId === data.senderId || d.receiverId === data.senderId
            )

            if (!checkConversation) {
                addNewAccountChat(data, cachedChatAccountList)
            } else {
                updateLastConversationChat(data, cachedChatAccountList)
            }
        } else if (data.senderId === user.id) {
            const checkConversation: ChatAccountDto = cachedChatAccountList?.find(
                d => data.receiverId === d.senderId || data.receiverId === d.receiverId
            )
            if (!checkConversation) {
                addNewAccountChat(data, cachedChatAccountList)
            } else {
                // updateLastConversationChat(data, cachedChatAccountList)
                const indexConv = cachedChatAccountList?.findIndex(
                    d => data.receiverId === d.senderId || data.receiverId === d.receiverId
                )

                const lastConv = cachedChatAccountList?.find(
                    d => data.receiverId === d.senderId || data.receiverId === d.receiverId
                )
                const newItems = cachedChatAccountList?.filter((f, i) => i !== indexConv)
                const newAccountChat: ChatAccountDto = {
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    lastMessage: data.message,
                    date: data.date,
                    read: data.read,
                    status: lastConv.status
                }

                newItems.unshift(newAccountChat)
                queryClient.setQueryData('chatAccountList', newItems)
            }
        }
    }

    // click to chat with another user exist
    const conversationMutationDetail = useMutation({
        mutationFn: (toId: number) => ChatAccountApis(t).getChatsFromUser(toId, user.id),
        onSuccess: (res: ChatMessagesType[]) => {
            setConversationList(res)
        }
    })

    const handelGetNewConversation = (id: number | null) => {
        setConversationList([])
        conversationMutationDetail.mutate(id)
    }

    // end

    const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
    const handleLeftSidebarShow = () => {
        setSideBarChatOpen(!sideBarChatOpen)
        setSelectChatId(null)
    }
    const handleUserProfileLeftSidebarToggle = () => setUserProfileLeftOpen(!userProfileLeftOpen)
    const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen)

    // connect to websocket

    const publishMessage = (msgReceive: ChatMessagesType) => {
        if (stompClient) {
            stompClient.send(`${msgReceive.receiverId}`, {}, `${msgReceive.message}`)
            const newMessageAdded: ChatMessagesType = {
                senderId: msgReceive.senderId,
                date: new Date(),
                message: msgReceive.message,
                receiverId: msgReceive.receiverId,
                read: false
            }
            setConversationList([...conversationList, newMessageAdded])
            handleChangeLastMsgConversation(newMessageAdded)
        }
    }

    const connect = () => {
        const sock = new SockJs(mmsApiUrls.apiUrl_MMS_SocketChat_EndPoint)
        const temp: any = over(sock)
        setStompClient(temp)
        const token = localStorage.getItem('accessToken')
        const headers = {
            senderId: user?.id,
            groupId: userData?.domainId, // domainId
            Authorization: `Bearer ${token}`
        }
        temp.connect(headers, onConnect, onError)
    }

    useEffect(() => {
        connect()
    }, [])

    const onMessageRecieve = (payload: any) => {
        console.log('message payload: ', JSON.parse(payload.body)) // console sami
        const res = JSON.parse(payload.body)
        if (res.type === 'MESSAGE') {
            // test type: message
            const newMessageAdded: ChatMessagesType = {
                senderId: res.senderId,
                date: new Date(),
                message: res.content,
                receiverId: user.id,
                read: false
            }
            setNewMessageTest(newMessageAdded)
            setSendSuccess(true)
            handleChangeLastMsgConversation(newMessageAdded)
        } else if (res.type === AccountChatStatus.STATUS) {
            console.log('connected senderId', res.senderId)
            changeStatusChat(res)
            changeStatusContact(res)
        } else {
            console.log('unsupported type', res)
        }
    }
    const changeStatusContact = res => {
        const newListContact: MiniAccountChatType[] = contactsAccount
        if (res.content === AccountChatStatus.CONNECTED) {
            newListContact?.map(f => {
                if (f.id === res.senderId) {
                    f.status = AccountChatStatus.CONNECTED
                    f.colorStatus = 'success'
                }
            })
            queryClient.setQueryData('contactsAccount', newListContact)
        } else if (res.content === AccountChatStatus.DISCONNECTED) {
            console.log('disconnected', res.senderId)
            newListContact?.map(f => {
                if (f.id === res.senderId) {
                    f.status = AccountChatStatus.DISCONNECTED
                    f.colorStatus = 'secondary'
                }
            })
            queryClient.setQueryData('contactsAccount', newListContact)
        } else {
            console.log('unsupported Status', res)
        }
    }

    const changeStatusChat = res => {
        const newList: ChatAccountDto[] = chatAccountList
        if (res.content === AccountChatStatus.CONNECTED) {
            newList?.map(f => {
                if (
                    (f.senderId !== user.id && f.senderId === res.senderId) ||
                    (f.receiverId !== user.id && f.receiverId === res.senderId)
                ) {
                    f.status = AccountChatStatus.CONNECTED
                    f.colorStatus = 'success'
                }
            })
            queryClient.setQueryData('chatAccountList', newList)
        } else if (res.content === AccountChatStatus.DISCONNECTED) {
            newList?.map(f => {
                if (
                    (f.senderId !== user.id && f.senderId === res.senderId) ||
                    (f.receiverId !== user.id && f.receiverId === res.senderId)
                ) {
                    f.status = AccountChatStatus.DISCONNECTED
                    f.colorStatus = 'secondary'
                }
            })
            queryClient.setQueryData('chatAccountList', newList)
        } else {
            console.log('unsupported Status', res)
        }
    }
    const onError = (error: any) => {
        console.log('error')
        console.log('no error', error)
    }
    const onConnect = () => {
        console.log('its connected ')
        setIsConnected(true)
    }

    useEffect(() => {
        if (isConnected && stompClient) {
            const subscriptionUser: any = stompClient?.subscribe(`/chat/user/${user.id}`, (payload: any) => {
                console.log('payload payload user', JSON.parse(payload.body))
                onMessageRecieve(payload)
            })

            const subscriptionGroup: any = stompClient?.subscribe(`/chat/group/${userData.domainId}`, (payload: any) => {
                console.log('payload payload group', JSON.parse(payload.body))
                onMessageRecieve(payload)
            })

            return () => {
                subscriptionUser.unsubscribe()
                subscriptionGroup.unsubscribe()
            }
        }
    }, [isConnected, stompClient])

    // fin

    return (
        <Grid>
            {sideBarChatOpen && !isLoading ? (
                <Box
                    className='app-chat'
                    sx={{
                        width: '100%',
                        display: 'flex',
                        borderRadius: 1,
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: 'background.paper',
                        boxShadow: skin === 'bordered' ? 0 : 6,
                        ...(skin === 'bordered' && {border: `1px solid ${theme.palette.divider}`})
                    }}
                >
                    {!isLoadingChatAccountList ? (
                        <SidebarLeft
                            hidden={hidden}
                            statusObj={statusObj}
                            userStatus={userStatus}
                            getInitials={getInitials}
                            sidebarWidth={sidebarWidth}
                            leftSidebarOpen={leftSidebarOpen}
                            userProfileLeftOpen={userProfileLeftOpen}
                            formatDateToMonthShort={formatDateToMonthShort}
                            handleLeftSidebarToggle={handleLeftSidebarToggle}
                            handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
                            showChat={showChat}
                            setShowChat={setShowChat}
                            handleLeftSidebarShow={handleLeftSidebarShow}
                            user={user}
                            contactsAccount={contactsAccount?.filter(f => f.id !== user.id)}
                            handelCheckImagePath={handelCheckImagePath}
                            setSelectChatId={setSelectChatId}
                            handelGetNewConversation={handelGetNewConversation}
                            chatAccountList={chatAccountList}
                        />
                    ) : null}

                    {selectChatId ? (
                        <>
                            <ChatContent
                                hidden={hidden}
                                mdAbove={mdAbove}
                                statusObj={statusObj}
                                getInitials={getInitials}
                                sidebarWidth={sidebarWidth}
                                userProfileRightOpen={userProfileRightOpen}
                                handleLeftSidebarToggle={handleLeftSidebarToggle}
                                handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
                                showChat={showChat}
                                setShowChat={setShowChat}
                                user={user}
                                contact={contactsAccount?.find(d => d.id === selectChatId)}
                                conversationList={conversationList}
                                newMessageTest={newMessageTest}
                                sendSuccess={sendSuccess}
                                setSendSuccess={setSendSuccess}
                                setConversationList={setConversationList}
                                publishMessage={publishMessage}
                            />
                        </>
                    ) : null}
                </Box>
            ) : (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: '5vh',
                        right: '10vh'
                    }}
                >
                    <IconButton size='small'>
                        <Icon
                            icon='tabler:message-chatbot-filled'
                            width='3rem'
                            height='3rem'
                            onClick={handleLeftSidebarShow}
                            color={theme.palette.primary.main}
                        />
                    </IconButton>
                </Box>
            )}
        </Grid>
    )
}

AppChat.contentHeightFixed = true

export default AppChat
