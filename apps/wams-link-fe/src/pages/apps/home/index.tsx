import { PostType } from 'link-shared/@core/types/link/PostTypes'
import { useQuery } from 'react-query'
import React, { useState } from 'react'
import PostList from '../components/postList/postList'
import AccountApis from 'ims-shared/@core/api/ims/account'
import Avatar from '@mui/material/Avatar'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import { Card, CardContent, Grid, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PostDialogue from '../components/dialogue'
import LeftColumn from '../components/leftRightColumn/leftColumn'
import RightColumn from '../components/leftRightColumn/rightColumn'
import PostApis from 'link-shared/@core/api/link/post'
import { MiniAccountChatType } from 'ims-shared/@core/types/ims/accountTypes'

const HomePage = () => {
  const { t } = useTranslation()
  const { data: user, isLoading: isLoadingUser } = useQuery(`user`, () => AccountApis(t).getAccountProfile())
  const { data: contactsAccount, isLoading: isLoadingAccount } = useQuery(['contactsAccount', user?.domain], () =>
    AccountApis(t).getAccountsByDomain(user?.domain)
  )
  const { data: posts, isLoading: isLoadingDataPosts } = useQuery(`posts`, () => PostApis(t).getPosts(0, 5))
  const [isOpen, setIsOpen] = useState(false)
  const handleOpenPop = () => {
    setIsOpen(true)
  }

  const handelCheckImagePath = (code: string) => {
    const profile: MiniAccountChatType = contactsAccount?.find(d => d.code === code)
    if (profile) {
      return profile.id
    } else return false
  }

  const [defaultValues, setDefaultValues] = useState<PostType>({
    domain: user?.domain,
    accountCode: user?.code,
    title: '',
    talk: '',
    editable: false,
    comments: [],
    file: null,
    imagePath: ''
  })

  return (
    !isLoadingUser && (
      <Grid
        container
        spacing={4}
        width={'100%'}
        sx={{
          maxWidth: '1710px',
          margin: 'auto'
        }}
      >
        <Grid item md={3} xs={12} sm={12}>
          <LeftColumn user={user} handelCheckImagePath={handelCheckImagePath} hideAvatar={false} />
        </Grid>

        <Grid item md={6} xs={12} sm={12}>
          <Card
            sx={{
              position: 'sticky',
              top: '66px',
              zIndex: 1000,
              maxWidth: '100%'
            }}
          >
            <CardContent>
              <Grid container spacing={4} alignItems='center'>
                <Grid item md={1} sm={1}>
                  <Avatar
                    alt='User Avatar'
                    src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${handelCheckImagePath(user?.code)}`}
                  />
                </Grid>
                <Grid item md={11} sm={11}>
                  <TextField
                    fullWidth
                    type='input'
                    size='small'
                    value={''}
                    onClick={handleOpenPop}
                    placeholder={t('Link.Start_a_public_post')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {!isLoadingAccount && !isLoadingDataPosts ? (
            <PostList contactsAccount={contactsAccount} user={user} posts={posts} />
          ) : null}
        </Grid>

        <Grid item md={3} xs={12} sm={12} className={'hide-column'}>
          <RightColumn />
        </Grid>

        {isOpen && (
          <PostDialogue
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            user={user}
            defaultValues={defaultValues}
            setDefaultValue={setDefaultValues}
          />
        )}
      </Grid>
    )
  )
}

export default HomePage
