import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useQuery } from 'react-query'
import { ResumeShareInfo } from 'rpm-shared/@core/types/rpm/ResumeTypes'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import { MinAccountDto } from 'ims-shared/@core/types/ims/accountTypes'
import AccountApis from 'ims-shared/@core/api/ims/account'
import SharedViewDrawer from '../list/SharedViewDrawer'
import Avatar from '@mui/material/Avatar'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { useTranslation } from 'react-i18next'
import imsApiUrls from 'ims-shared/configs/ims_apis'

const ViewShareInfo = props => {
  const { t } = useTranslation()
  const { editedData, setEditedData } = props
  const [openShareView, setOpenShareView] = useState<boolean>(false)
  const [sharedInfo, setSharedInfo] = useState<ResumeShareInfo>()

  const { data: accounts, isLoading: isLoadingAccount } = useQuery(`accounts`, () => AccountApis(t).getAccounts())

  function getMiniAccountByCode(val: string): MinAccountDto {
    for (const acc of accounts) {
      if (acc.code == val) {
        return acc
      }
    }

    return null
  }

  function getUserNameFromAccountCode(val: string): string {
    for (const acc of accounts) {
      if (acc.code == val) {
        return acc.accountDetails.firstName + acc.accountDetails.lastName
      }
    }

    return ''
  }

  const setReview = (review: ResumeShareInfo) => {
    const updatedReviews = editedData.resumeShareInfos?.map(rev => {
      if (rev.id === review.id) {
        console.log('found the value to edit')

        return {
          ...rev,
          sharedWith: review.sharedWith,
          comment: review.comment,
          rate: review.rate
        }
      }

      return rev
    })

    // Return the updated data with the modified review
    setEditedData({
      ...editedData,
      resumeShareInfos: updatedReviews
    })
  }

  const handleShareViewOpen = (sharedInfo: ResumeShareInfo) => {
    setSharedInfo(sharedInfo)
    setOpenShareView(true)
  }

  return !isLoadingAccount ? (
    <>
      {editedData.resumeShareInfos && editedData.resumeShareInfos.length > 0 ? (
        <Grid item xs={12} sm={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <div style={{ maxHeight: '250px', minHeight: '250px', overflowY: 'auto' }}>
                {editedData.resumeShareInfos?.map((sharedData: ResumeShareInfo) => {
                  return (
                    <Grid key={sharedData.id} container direction='row' spacing={2} mt={1}>
                      <Grid item>
                        <Avatar
                          src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${
                            getMiniAccountByCode(sharedData.sharedWith).id
                          }`}
                          sx={{ mr: 1, height: 38, width: 38 }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle1'>{getUserNameFromAccountCode(sharedData.sharedWith)}</Typography>
                      </Grid>
                      <Grid item>
                        <Rating readOnly value={sharedData?.rate} />
                      </Grid>
                      {checkPermission(
                        PermissionApplication.RPM,
                        PermissionPage.RESUME_SHARE_INFO,
                        PermissionAction.WRITE
                      ) && (
                        <Grid item>
                          <IconButton
                            size='small'
                            sx={{ color: 'text.secondary' }}
                            onClick={() => {
                              handleShareViewOpen(sharedData)
                            }}
                          >
                            <Icon icon='fluent:slide-text-edit-24-regular' />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </Grid>
      ) : null}

      {openShareView && sharedInfo && (
        <SharedViewDrawer
          open={openShareView}
          setOpen={setOpenShareView}
          resumeShareInfo={sharedInfo}
          accountData={getMiniAccountByCode(sharedInfo.sharedWith)}
          setResume={setReview}
        />
      )}
    </>
  ) : null
}

export default ViewShareInfo
