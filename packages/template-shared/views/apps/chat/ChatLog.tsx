// ** React Imports
import React, { ReactNode, Ref, useEffect, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
// ** Third Party Components
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomAvatar from 'template-shared/@core/components/mui/avatar'

// ** Utils Imports
import { getInitials } from 'template-shared/@core/utils/get-initials'

// ** Types Imports
import {
  ChatLogChatType,
  ChatMessagesType,
  FormattedChatsType,
  MessageGroupType,
  SelectedChatAccountProps
} from 'template-shared/@core/types/chat/chatTypes'
import { formatDateToMontTimeShort } from 'template-shared/@core/utils/format'
import Tooltip from '@mui/material/Tooltip'
import imsApiUrls from 'ims-shared/configs/ims_apis'

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: Ref<unknown> }>(({ theme }) => ({
  padding: theme.spacing(5)
}))

const ChatLog = (props: SelectedChatAccountProps) => {
  // ** Props
  const { chat, contact, userContact, hidden } = props

  // ** Ref
  const chatArea = useRef(null)

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog: ChatMessagesType[] | [] = []
    if (chat) {
      chatLog = chat
      scrollToBottom()
    }

    const formattedChatLog: FormattedChatsType[] = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : 11
    let msgGroup: MessageGroupType = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg: ChatMessagesType, index: number) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          time: msg.date,
          msg: msg.message
        })
      } else {
        chatMessageSenderId = msg.senderId

        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              time: msg.date,
              msg: msg.message
            }
          ]
        }
      }

      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })

    return formattedChatLog
  }
  const scrollToBottom = () => {
    if (chatArea.current) {
      if (hidden) {
        // @ts-ignore
        chatArea.current.scrollTop = chatArea.current.scrollHeight
      } else {
        // @ts-ignore
        chatArea.current._container.scrollTop = chatArea.current._container.scrollHeight
      }
    }
  }

  useEffect(() => {
    if (chat && chat.length) {
      scrollToBottom()
    }
  }, [chat])

  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item: FormattedChatsType, index: number) => {
      const isSender = item.senderId === userContact.id

      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: !isSender ? 'row' : 'row-reverse',
            mb: index !== formattedChatData().length - 1 ? 4 : undefined
          }}
        >
          <div>
            <CustomAvatar
              skin='light'
              color='error'
              sx={{
                width: 32,
                height: 32,
                fontSize: '1rem',
                ml: isSender ? 3 : undefined,
                mr: !isSender ? 3 : undefined
              }}
              {...(contact.imagePath && !isSender
                ? {
                    src: `${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${contact.id}`,
                    alt: contact.fullName
                  }
                : {})}
              {...(isSender
                ? {
                    src: `${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${userContact.id}`,
                    alt: userContact.accountDetails.firstName + ' ' + userContact.accountDetails.lastName
                  }
                : {})}
            >
              {contact.avatarColor ? getInitials(contact.fullName) : null}
            </CustomAvatar>
          </div>

          <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
            {item.messages.map((chat: ChatLogChatType, index: number, { length }: { length: number }) => {
              const time = new Date(chat.time)

              return (
                <Box key={index} sx={{ '&:not(:last-of-type)': { mb: 3 } }}>
                  <Tooltip title={formatDateToMontTimeShort(time, false)}>
                    <div>
                      <Typography
                        sx={{
                          boxShadow: 1,
                          borderRadius: 1,
                          maxWidth: '100%',
                          width: 'fit-content',
                          wordWrap: 'break-word',
                          p: theme => theme.spacing(2.25, 4),
                          ml: isSender ? 'auto' : undefined,
                          borderTopLeftRadius: !isSender ? 0 : undefined,
                          borderTopRightRadius: isSender ? 0 : undefined,
                          color: isSender ? 'common.white' : 'text.primary',
                          backgroundColor: isSender ? 'primary.main' : 'background.paper'
                        }}
                      >
                        {chat.msg}
                      </Typography>
                    </div>
                  </Tooltip>

                  {index + 1 === length ? (
                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSender ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {/*{renderMsgFeedback(isSender, chat.feedback)}*/}
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        {formatDateToMontTimeShort(time, false)}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
              )
            })}
          </Box>
        </Box>
      )
    })
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return (
        <Box ref={chatArea} sx={{ p: 5, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      )
    } else {
      return (
        <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false }}>
          {children}
        </PerfectScrollbar>
      )
    }
  }

  return (
    <Box sx={{ height: 'calc(100% - 8.9375rem)' }}>
      <ScrollWrapper>{renderChats()}</ScrollWrapper>
    </Box>
  )
}

export default ChatLog
