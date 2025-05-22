import Typography from '@mui/material/Typography'
import { useQuery } from 'react-query'
import React from 'react'
import AccountApis from 'ims-shared/@core/api/ims/account'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import LeftColumn from '../../components/leftRightColumn/leftColumn'
import BlogView from '../blogView'
import PostView from '../postView'
import { useTranslation } from 'react-i18next'
import PostApis from 'link-shared/@core/api/link/post'
import { MiniAccountChatType } from 'ims-shared/@core/types/ims/accountTypes'

const Detail = () => {
  const { t } = useTranslation()
  const { data: user } = useQuery(`user`, () => AccountApis(t).getAccountProfile())
  const { data: contactsAccount } = useQuery(['contactsAccount', user?.domain], () =>
    AccountApis(t).getAccountsByDomain(user?.domain)
  )
  const router = useRouter()
  const { id } = router.query

  const { data: dataDetail, isLoading: isLoadingData } = useQuery(
    `dataDetail`,
    () => id && PostApis(t).getPostById(Number(id))
  )

  const handelCheckImagePath = (code: string) => {
    const profile: MiniAccountChatType = contactsAccount?.find(d => d.code === code)
    if (profile) {
      return profile.id
    } else return false
  }

  const getNameAccount = (code: string) => {
    const nameAccount = contactsAccount?.find(c => c.code === code)

    return nameAccount?.fullName
  }

  const getFunctionRole = (code: string) => {
    const nameAccount = contactsAccount?.find(c => c.code === code)

    return nameAccount?.functionRole
  }

  return (
    <>
      {!isLoadingData && dataDetail ? (
        <Grid container spacing={4} width={'100%'} sx={{ maxWidth: '1710px', margin: 'auto' }}>
          <Grid item md={9} xs={12} sm={12}>
            {dataDetail.isBlog ? (
              <BlogView
                id={Number(id)}
                user={user}
                handelCheckImagePath={handelCheckImagePath}
                getNameAccount={getNameAccount}
                getFunctionRole={getFunctionRole}
                data={dataDetail}
              />
            ) : (
              <PostView
                id={Number(id)}
                user={user}
                handelCheckImagePath={handelCheckImagePath}
                getNameAccount={getNameAccount}
                getFunctionRole={getFunctionRole}
              />
            )}
          </Grid>
          <Grid item md={3} xs={12} sm={12}>
            <LeftColumn handelCheckImagePath={handelCheckImagePath} user={user} hideAvatar={true} />
          </Grid>
        </Grid>
      ) : (
        <Typography>There is no data </Typography>
      )}
    </>
  )
}

export default Detail
