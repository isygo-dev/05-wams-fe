// ** React Imports
import {ChangeEvent, ReactNode, useEffect, useState} from 'react'

// ** Next Import
import {useRouter} from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import MuiAvatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Util Import
import {hexToRGBA} from 'template-shared/@core/utils/hex-to-rgba'

// ** Types
import {ChatAccountDto, ChatSidebarLeftType} from 'template-shared/@core/types/chat/chatTypes'

// ** Custom Components Import
import CustomAvatar from 'template-shared/@core/components/mui/avatar'
import {MiniAccountChatType} from 'ims-shared/@core/types/ims/accountTypes'
import {useTranslation} from 'react-i18next'
import imsApiUrls from "ims-shared/configs/ims_apis"

// ** Chat App Components Imports

const ScrollWrapper = ({children, hidden}: { children: ReactNode; hidden: boolean }) => {
    if (hidden) {
        return <Box sx={{height: '100%', overflow: 'auto'}}>{children}</Box>
    } else {
        return <PerfectScrollbar options={{wheelPropagation: false}}>{children}</PerfectScrollbar>
    }
}

const SidebarLeft = (props: ChatSidebarLeftType) => {
    // ** Props
    const {
        hidden,
        statusObj,
        userStatus,
        getInitials,
        sidebarWidth,
        leftSidebarOpen,
        formatDateToMonthShort,
        handleLeftSidebarToggle,
        handleLeftSidebarShow,
        handleUserProfileLeftSidebarToggle,
        setShowChat,
        user,
        contactsAccount,
        handelCheckImagePath,
        setSelectChatId,
        handelGetNewConversation,
        chatAccountList
    } = props

    // ** States
    const [query, setQuery] = useState<string>('')
    const [filteredContacts, setFilteredContacts] = useState<MiniAccountChatType[]>([])
    const [active, setActive] = useState<null | { type: string; id: number }>(null)

    // console.log(removeSelectedChat)

    // ** Hooks
    const router = useRouter()
    const handleChatClickContact = (type: string, id: number) => {
        setSelectChatId(id)
        setActive({type, id})
        setShowChat(true)
        handelGetNewConversation(id)

        setFilteredContacts([])
        setQuery('')
    }
    const handleChatClick = (type: string, chatAccount: ChatAccountDto) => {
        let id: number
        if (chatAccount.receiverId !== user.id) {
            setSelectChatId(chatAccount.receiverId)
            handelGetNewConversation(chatAccount.receiverId)
            id = chatAccount.receiverId
            setActive({type, id})
        } else {
            setSelectChatId(chatAccount.senderId)
            handelGetNewConversation(chatAccount.senderId)
            id = chatAccount.senderId
            setActive({type, id})
        }

        setShowChat(true)
    }

    useEffect(() => {
        router.events.on('routeChangeComplete', () => {
            setActive(null)
        })

        return () => {
            setActive(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const hasActiveId = (id: number | string) => {
        if (chatAccountList !== null) {
            const arr = chatAccountList.filter(i => i.senderId === id)

            return !!arr.length
        }
    }

    const handelGetStatusChat = (senderId: number, receiveId: number) => {
        let getUser: MiniAccountChatType
        if (contactsAccount && contactsAccount.length > 0) {
            if (senderId === user.id) {
                getUser = contactsAccount?.find(d => d.id === receiveId)
            } else {
                getUser = contactsAccount?.find(d => d.id === senderId)
            }

            return getUser?.status
        }
    }

    const handelGetFullName = (userId: number) => {
        if (contactsAccount && contactsAccount.length > 0) {
            const getUser = contactsAccount?.find(d => d.id === userId)

            return getUser?.fullName
        }

        return ''
    }

    const {t} = useTranslation()
    const renderChats = () => {
        if (chatAccountList && chatAccountList.length) {
            if (chatAccountList.length <= 0) {
                return (
                    <ListItem>
                        <Typography sx={{color: 'text.secondary'}}>No Chats Found</Typography>
                    </ListItem>
                )
            } else if (!chatAccountList || chatAccountList?.length < 0) {
                return (
                    <ListItem>
                        <Typography sx={{color: 'text.secondary'}}>No Chats Found</Typography>
                    </ListItem>
                )
            } else {
                return chatAccountList.map((chat: ChatAccountDto, index: number) => {
                    const activeCondition = active !== null && active.id === chat.receiverId && active.type === 'chat'

                    return (
                        <ListItem key={index} disablePadding sx={{'&:not(:last-child)': {mb: 1}}}>
                            <ListItemButton
                                disableRipple
                                onClick={() => handleChatClick('chat', chat)}
                                sx={{
                                    py: 2,
                                    px: 3,
                                    width: '100%',
                                    borderRadius: 1,
                                    alignItems: 'flex-start',

                                    ...(activeCondition && {
                                        background: theme =>
                                            `linear-gradient(72.47deg, ${theme.palette.primary.main} 22.16%, ${hexToRGBA(
                                                theme.palette.primary.main,
                                                0.7
                                            )} 76.47%) !important`
                                    })
                                }}
                            >
                                <ListItemAvatar sx={{m: 0, alignSelf: 'center'}}>
                                    <Badge
                                        overlap='circular'
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right'
                                        }}
                                        badgeContent={
                                            <Box
                                                component='span'
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',

                                                    color: `${statusObj[handelGetStatusChat(chat.senderId, chat.receiverId)]}.main`,
                                                    backgroundColor: `${statusObj[handelGetStatusChat(chat.senderId, chat.receiverId)]}.main`,

                                                    // color: `${chat.colorStatusDelete}.main`,
                                                    // backgroundColor: `${chat.colorStatusDelete}.main`,
                                                    boxShadow: theme =>
                                                        `0 0 0 2px ${
                                                            !activeCondition ? theme.palette.background.paper : theme.palette.common.white
                                                        }`
                                                }}
                                            />
                                        }
                                    >
                                        {chat.receiverId !== user.id ? (
                                            <>
                                                {handelCheckImagePath(chat.receiverId) ? (
                                                    <MuiAvatar
                                                        src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${chat.receiverId}`}
                                                        alt={handelGetFullName(chat.receiverId)}
                                                        sx={{
                                                            width: 38,
                                                            height: 38,
                                                            outline: theme =>
                                                                `2px solid ${activeCondition ? theme.palette.common.white : 'transparent'}`
                                                        }}
                                                    />
                                                ) : (
                                                    <>
                                                        <CustomAvatar
                                                            skin={activeCondition ? 'light-static' : 'light'}
                                                            sx={{
                                                                width: 38,
                                                                height: 38,
                                                                fontSize: '1rem',
                                                                outline: theme =>
                                                                    `2px solid ${activeCondition ? theme.palette.common.white : 'transparent'}`
                                                            }}
                                                        >
                                                            {getInitials(handelGetFullName(chat.receiverId))}
                                                        </CustomAvatar>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {handelCheckImagePath(chat.senderId) ? (
                                                    <MuiAvatar
                                                        src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${chat.senderId}`}
                                                        alt={handelGetFullName(chat.senderId)}
                                                        sx={{
                                                            width: 38,
                                                            height: 38,
                                                            outline: theme =>
                                                                `2px solid ${activeCondition ? theme.palette.common.white : 'transparent'}`
                                                        }}
                                                    />
                                                ) : (
                                                    <>
                                                        <CustomAvatar
                                                            skin={activeCondition ? 'light-static' : 'light'}
                                                            sx={{
                                                                width: 38,
                                                                height: 38,
                                                                fontSize: '1rem',
                                                                outline: theme =>
                                                                    `2px solid ${activeCondition ? theme.palette.common.white : 'transparent'}`
                                                            }}
                                                        >
                                                            {getInitials(handelGetFullName(chat.senderId))}
                                                        </CustomAvatar>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        my: 0,
                                        ml: 3,
                                        mr: 1.5,
                                        '& .MuiTypography-root': {...(activeCondition && {color: 'common.white'})}
                                    }}
                                    primary={
                                        <Typography noWrap sx={{fontWeight: 500}}>
                                            {chat.receiverId !== user.id ? (
                                                handelGetFullName(chat.receiverId)
                                            ) : (
                                                <>{handelGetFullName(chat.senderId)}</>
                                            )}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography noWrap sx={{...(!activeCondition && {color: 'text.secondary'})}}>
                                            <>
                                                {chat.senderId === user.id ? (
                                                    <>
                                                        {t('You')}: {chat.lastMessage}
                                                    </>
                                                ) : (
                                                    <>{chat.lastMessage}</>
                                                )}
                                            </>
                                        </Typography>
                                    }
                                />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start'
                                    }}
                                >
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            fontSize: '0.77rem',
                                            color: activeCondition ? 'common.white' : 'text.disabled'
                                        }}
                                    >
                                        <>{chat.lastMessage ? formatDateToMonthShort(chat.date as string, false) : new Date()}</>
                                    </Typography>
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    )
                })
            }
        }
    }

    const renderContacts = () => {
        if (contactsAccount && contactsAccount.length) {
            if (query.length > 0 && filteredContacts.length <= 0) {
                return (
                    <ListItem>
                        <Typography sx={{color: 'text.secondary'}}>No Contacts Found</Typography>
                    </ListItem>
                )
            } else {
                const arrToMap = query.length && filteredContacts.length ? filteredContacts : contactsAccount

                return arrToMap !== null
                    ? arrToMap.map((contact: MiniAccountChatType, index: number) => {
                        const activeCondition =
                            active !== null && active.id === contact.id && active.type === 'contact' && !hasActiveId(contact.id)

                        return (
                            <ListItem key={index} disablePadding sx={{'&:not(:last-child)': {mb: 1}}}>
                                <ListItemButton
                                    disableRipple
                                    onClick={() => handleChatClickContact('contact', contact.id)}
                                    sx={{
                                        py: 2,
                                        px: 3,
                                        width: '100%',
                                        borderRadius: 1,
                                        ...(activeCondition && {
                                            background: theme =>
                                                `linear-gradient(72.47deg, ${theme.palette.primary.main} 22.16%, ${hexToRGBA(
                                                    theme.palette.primary.main,
                                                    0.7
                                                )} 76.47%) !important`
                                        })
                                    }}
                                >
                                    <ListItemAvatar sx={{m: 0}}>
                                        <Badge
                                            overlap='circular'
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            badgeContent={
                                                <Box
                                                    component='span'
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',

                                                        // color: contact.colorStatus !==  ('secondary' || undefined)  ? `${contact.colorStatus}.main` : 'secondary',
                                                        // backgroundColor: contact.colorStatus !==  ('secondary' || undefined)  ? `${contact.colorStatus}.main` : 'secondary',

                                                        color: `${statusObj[contact.status]}.main`,
                                                        backgroundColor: `${statusObj[contact.status]}.main`,

                                                        boxShadow: theme =>
                                                            `0 0 0 2px ${
                                                                !activeCondition ? theme.palette.background.paper : theme.palette.common.white
                                                            }`
                                                    }}
                                                />
                                            }
                                        >
                                            {contact.imagePath && contact.imagePath !== 'defaultPhoto.jpg' ? (
                                                <MuiAvatar
                                                    alt={contact.fullName}
                                                    src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${contact.id}`}
                                                    sx={{
                                                        width: 38,
                                                        height: 38,
                                                        outline: theme =>
                                                            `2px solid ${activeCondition ? theme.palette.common.white : 'transparent'}`
                                                    }}
                                                />
                                            ) : (
                                                <CustomAvatar
                                                    skin={activeCondition ? 'light-static' : 'light'}
                                                    sx={{
                                                        width: 38,
                                                        height: 38,
                                                        fontSize: '1rem',
                                                        outline: theme =>
                                                            `2px solid ${activeCondition ? theme.palette.common.white : 'transparent'}`
                                                    }}
                                                >
                                                    {getInitials(handelGetFullName(contact.id))}
                                                </CustomAvatar>
                                            )}
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            my: 0,
                                            ml: 3,
                                            ...(activeCondition && {'& .MuiTypography-root': {color: 'common.white'}})
                                        }}
                                        primary={<Typography
                                            sx={{fontWeight: 500}}>{handelGetFullName(contact.id)}</Typography>}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    })
                    : null
            }
        }
    }

    const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        if (contactsAccount !== null) {
            const searchFilterFunction = (contact: MiniAccountChatType) =>
                contact.fullName.trim().toLowerCase().includes(e.target.value.toLowerCase())

            const filteredContactsArr = contactsAccount?.filter(searchFilterFunction)

            setFilteredContacts(filteredContactsArr)
        }
    }

    return (
        <div
            style={{
                right: '43px',
                position: 'fixed',
                width: '360px',
                bottom: '16px',
                zIndex: '1001',
                height: '67vh',
                overflowY: 'auto',
                boxShadow:
                    '0px 3px 9px 1px rgb(51 48 60 / 28%), 0px 8px 9px 0px rgb(51 48 60 / 28%), 0px 1px 6px 4px rgb(51 48 60 / 17%)'
            }}
        >
            <Drawer
                open={leftSidebarOpen}
                anchor={'right'}
                onClose={handleLeftSidebarToggle}
                variant={'permanent'}
                ModalProps={{
                    disablePortal: true,
                    keepMounted: true // Better open performance on mobile.
                }}
                sx={{
                    zIndex: 7,
                    height: '100%',
                    display: 'block',
                    position: 'static',
                    '& .MuiDrawer-paper': {
                        boxShadow: 'none',
                        width: sidebarWidth,
                        position: 'static',
                        borderTopLeftRadius: theme => theme.shape.borderRadius,
                        borderBottomLeftRadius: theme => theme.shape.borderRadius
                    },
                    '& > .MuiBackdrop-root': {
                        borderRadius: 1,
                        position: 'static',
                        zIndex: theme => theme.zIndex.drawer - 1
                    }
                }}
            >
                <Box
                    sx={{
                        py: 3,
                        px: 5,
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: theme => `1px solid ${theme.palette.divider}`
                    }}
                >
                    {user ? (
                        <Badge
                            overlap='circular'
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            sx={{mr: 3}}
                            onClick={handleUserProfileLeftSidebarToggle}
                            badgeContent={
                                <Box
                                    component='span'
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        color: `${statusObj[userStatus]}.main`,
                                        backgroundColor: `${statusObj[userStatus]}.main`,
                                        boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
                                    }}
                                />
                            }
                        >
                            <MuiAvatar
                                src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${user.id}`}
                                alt={user.accountDetails.firstName + '-' + user.accountDetails.lastName}
                                sx={{width: '2.375rem', height: '2.375rem', cursor: 'pointer'}}
                            />
                        </Badge>
                    ) : null}
                    <TextField
                        fullWidth
                        size='small'
                        value={query}
                        onChange={handleFilter}
                        placeholder='Search for contact...'
                        sx={{'& .MuiInputBase-root': {borderRadius: 5}}}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start' sx={{color: 'text.secondary'}}>
                                    <Icon icon='tabler:search' fontSize={20}/>
                                </InputAdornment>
                            )
                        }}
                    />

                    <IconButton sx={{p: 1, ml: 1}}>
                        <Icon icon='tabler:minus' onClick={handleLeftSidebarShow}/>
                    </IconButton>
                </Box>

                <Box sx={{height: `calc(100% - 4.0625rem)`}}>
                    <ScrollWrapper hidden={hidden}>
                        <Box sx={{p: theme => theme.spacing(5, 3, 3)}}>
                            {(filteredContacts && filteredContacts.length > 0) || query.length > 0 ? (
                                <>
                                    <Typography variant='h6' sx={{ml: 3, mb: 3.5, color: 'primary.main'}}>
                                        {t('Contacts')}
                                    </Typography>
                                    <List sx={{p: 0}}>{renderContacts()}</List>
                                </>
                            ) : (
                                <>
                                    <Typography variant='h6' sx={{ml: 3, mb: 3.5, color: 'primary.main'}}>
                                        {t('Chats')}
                                    </Typography>
                                    <List sx={{mb: 5, p: 0}}>{renderChats()}</List>
                                </>
                            )}
                        </Box>
                    </ScrollWrapper>
                </Box>
            </Drawer>
        </div>
    )
}

export default SidebarLeft
