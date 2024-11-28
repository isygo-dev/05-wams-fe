import {Fragment} from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Custom Components Import
import ChatLog from './ChatLog'
import CustomAvatar from 'template-shared/@core/components/mui/avatar'
import {ChatContentType, ChatMessagesType} from 'template-shared/@core/types/chat/chatTypes'
import SendMsgForm from './SendMsgForm'
import imsApiUrls from "ims-shared/configs/ims_apis"

const ChatContent = (props: ChatContentType) => {
    const handleCloseChat = () => {
        setShowChat(false)
    }

    // ** Props
    const {
        hidden,
        mdAbove,
        statusObj,
        getInitials,
        sidebarWidth,
        userProfileRightOpen,
        handleLeftSidebarToggle,
        handleUserProfileRightSidebarToggle,
        showChat,
        setShowChat,
        user,
        contact,
        conversationList,
        newMessageTest,
        sendSuccess,
        setSendSuccess,
        setConversationList,
        publishMessage
    } = props

    console.log(sidebarWidth, userProfileRightOpen)
    if (sendSuccess) {
        if (newMessageTest.senderId === user.id && newMessageTest.receiverId === user.id) {
            setConversationList([...conversationList, newMessageTest])
        } else if (contact && newMessageTest.senderId === contact.id && newMessageTest.receiverId === user.id) {
            setConversationList([...conversationList, newMessageTest])
        }
        setSendSuccess(false)
    }

    const handelSendMessage = (msg: string) => {
        if (msg.trim() !== '') {
            const newMessageAdded: ChatMessagesType = {
                senderId: user.id,
                date: new Date(),
                message: msg,
                receiverId: contact.id,
                read: false
            }
            publishMessage(newMessageAdded)
        }
    }

    const renderContent = () => {
        if (showChat && conversationList) {
            return (
                <Box
                    sx={{
                        position: 'fixed',
                        width: '422px',
                        bottom: '16px',
                        right: '27rem',
                        boxShadow:
                            '0px 3px 9px 1px rgb(51 48 60 / 28%), 0px 8px 9px 0px rgb(51 48 60 / 28%), 0px 1px 6px 4px rgb(51 48 60 / 17%)',
                        height: '54vh',
                        zIndex: '1000',
                        backgroundColor: 'white',
                        flexGrow: 1
                    }}
                >
                    <Box
                        sx={{
                            py: 2,
                            px: 5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'background.paper',
                            borderBottom: theme => `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            {mdAbove ? null : (
                                <IconButton onClick={handleLeftSidebarToggle} sx={{mr: 2}}>
                                    <Icon icon='tabler:menu-2'/>
                                </IconButton>
                            )}
                            <Box
                                onClick={handleUserProfileRightSidebarToggle}
                                sx={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}
                            >
                                <Badge
                                    overlap='circular'
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    sx={{mr: 3}}
                                    badgeContent={
                                        <Box
                                            component='span'
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                color: `${statusObj[contact.status]}.main`,
                                                backgroundColor: `${statusObj[contact.status]}.main`,

                                                boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
                                            }}
                                        />
                                    }
                                >
                                    {contact.imagePath && contact.imagePath !== 'defaultPhoto.jpg' ? (
                                        <MuiAvatar
                                            sx={{width: 38, height: 38}}
                                            src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${contact.id}`}
                                        />
                                    ) : (
                                        <CustomAvatar skin='light' sx={{width: 38, height: 38, fontSize: '1rem'}}>
                                            {getInitials(contact.fullName)}
                                        </CustomAvatar>
                                    )}
                                </Badge>
                                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                    <Typography sx={{fontWeight: 500}}>{contact.fullName}</Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            {mdAbove ? (
                                <Fragment>
                                    {/*<IconButton size='small' sx={{color: 'text.secondary'}}>*/}
                                    {/*    <Icon icon='tabler:phone-call'/>*/}
                                    {/*</IconButton>*/}
                                    {/*<IconButton size='small' sx={{color: 'text.secondary'}}>*/}
                                    {/*    <Icon icon='tabler:video'/>*/}
                                    {/*</IconButton>*/}
                                    {/*<IconButton size='small' sx={{color: 'text.secondary'}}>*/}
                                    {/*    <Icon icon='tabler:search'/>*/}
                                    {/*</IconButton>*/}
                                    <IconButton size='small' sx={{color: 'text.secondary'}}>
                                        <Icon icon='tabler:x' onClick={handleCloseChat}/>
                                    </IconButton>
                                </Fragment>
                            ) : null}

                            {/*<OptionsMenu*/}
                            {/*    menuProps={{sx: {mt: 2}}}*/}
                            {/*    icon={<Icon icon='tabler:dots-vertical'/>}*/}
                            {/*    iconButtonProps={{size: 'small', sx: {color: 'text.secondary'}}}*/}
                            {/*    options={['View Contact', 'Mute Notifications', 'Block Contact', 'Clear Chat', 'Report']}*/}
                            {/*/>*/}
                        </Box>
                    </Box>
                    <ChatLog hidden={hidden} chat={conversationList} contact={contact} userContact={user}/>
                    {/*{selectedChatAccount ? (*/}
                    {/*    <ChatLog hidden={hidden} data={selectedChatAccount}/>*/}
                    {/*) : null}*/}

                    <SendMsgForm setNewMessage={handelSendMessage}/>

                    {/*<UserProfileRight*/}
                    {/*    store={store}*/}
                    {/*    hidden={hidden}*/}
                    {/*    statusObj={statusObj}*/}
                    {/*    getInitials={getInitials}*/}
                    {/*    sidebarWidth={sidebarWidth}*/}
                    {/*    userProfileRightOpen={userProfileRightOpen}*/}
                    {/*    handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}*/}
                    {/*/>*/}
                </Box>
            )
        } else {
            return null
        }
    }

    return <>{renderContent()}</>
}

export default ChatContent
