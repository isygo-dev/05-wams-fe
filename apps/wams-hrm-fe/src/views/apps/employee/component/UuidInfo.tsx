import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import { UpdateCin } from './UpdateCin'
import { UpdatePassport } from './UpdatePassport'
import { useMutation } from 'react-query'
import { UpdateSecurity } from './UpdateSecurity'
import Divider from '@mui/material/Divider'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { checkPermission } from 'template-shared/@core/api/helper/permission'
import EmployeeApis from 'hrm-shared/@core/api/hrm/employee'

export function UuidInfo({ employeeData, refetch }) {
  const { t } = useTranslation()
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [editOpenPassport, setEditOpenPassport] = useState<boolean>(false)
  const [editOpenSecurity, setEditOpenSecurity] = useState<boolean>(false)
  const toggleEditDrawer = () => setEditOpen(!editOpen)
  const toggleEditPassportDrawer = () => setEditOpenPassport(!editOpenPassport)
  const toggleEditSecurityDrawer = () => setEditOpenSecurity(!editOpenSecurity)

  function handleOpenEdit() {
    setEditOpen(true)
  }

  function handleOpenEditPassport() {
    setEditOpenPassport(true)
  }

  function handleOpenEditSecurity() {
    setEditOpenSecurity(true)
  }

  function downloadPassportFunction() {
    console.log(employeeData.details?.passport[0]?.id)
    downloadPassportMutation.mutate(employeeData.details?.passport[0]?.id)
  }

  function downloadCinFunction() {
    console.log(employeeData.details?.cin[0]?.id)
    downloadCinMutation.mutate(employeeData.details?.cin[0]?.id)
  }

  function downloadSecurityFunction() {
    console.log(employeeData.details?.securities[0]?.id)
    downloadSecurityMutation.mutate(employeeData.details?.securities[0]?.id)
  }

  const downloadPassportMutation = useMutation({
    mutationFn: (data: number) => EmployeeApis(t).downloadTravelDocImage(data),
    onSuccess: () => {}
  })

  const downloadCinMutation = useMutation({
    mutationFn: (data: number) => EmployeeApis(t).downloadIdentityDocImage(data),
    onSuccess: () => {}
  })

  const downloadSecurityMutation = useMutation({
    mutationFn: (data: number) => EmployeeApis(t).downloadSecurityDocImage(data),
    onSuccess: () => {}
  })

  return (
    <>
      <Grid container spacing={3}>
        {checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE_CIN, PermissionAction.READ) && (
          <Grid sx={{ height: 'auto' }} item xs={12} sm={4} md={4}>
            <Box
              sx={{
                p: 4,
                display: 'flex',
                borderRadius: 1,
                flexDirection: ['column', 'row'],
                justifyContent: ['space-between'],
                backgroundColor: 'white',
                alignItems: ['flex-start', 'center'],
                height: '100%'
              }}
            >
              <Grid sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ color: 'text.primary', fontWeight: 'bold', flexGrow: 1 }}>
                    {t('Employee.Identity_Document')}
                  </Typography>
                  {checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE_CIN, PermissionAction.WRITE) && (
                    <Box sx={{ alignItems: 'center', marginRight: '10px' }}>
                      <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={handleOpenEdit}>
                        <Icon icon='tabler:edit' />
                      </IconButton>
                      <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={downloadCinFunction}>
                        <Icon icon='tabler:download' />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ m: '0 !important' }} />

                {employeeData?.details?.cin?.length > 0 ? (
                  <>
                    <p>Card Number : {employeeData?.details?.cin[0].cardNumber}</p>
                    <p>Issued Place : {employeeData?.details?.cin[0]?.issuedPlace}</p>
                    <p>Issued Date : {employeeData?.details?.cin[0]?.issuedDate}</p>
                  </>
                ) : (
                  <>
                    <p>{t('Employee.Card_Number')}: </p>
                    <p>{'Employee.Issued_Place'}: </p>
                    <p>{'Employee.Issued Date'}: </p>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
        )}
        {checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE_PASSPORT, PermissionAction.READ) && (
          <Grid sx={{ height: 'auto' }} item xs={12} sm={4} md={4}>
            <Box
              sx={{
                p: 4,
                display: 'flex',
                borderRadius: 1,
                flexDirection: ['column', 'row'],
                justifyContent: ['space-between'],
                backgroundColor: 'white',
                alignItems: ['flex-start', 'center'],
                height: '100%'
              }}
            >
              <Grid sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ color: 'text.primary', fontWeight: 'bold', flexGrow: 1 }}>
                    {t('Employee.Travel_Document')}
                  </Typography>
                  {checkPermission(
                    PermissionApplication.HRM,
                    PermissionPage.EMPLOYEE_PASSPORT,
                    PermissionAction.WRITE
                  ) && (
                    <Box sx={{ alignItems: 'center', marginRight: '10px' }}>
                      <IconButton
                        size='small'
                        sx={{ color: 'text.secondary' }}
                        onClick={() => handleOpenEditPassport()}
                      >
                        <Icon icon='tabler:edit' />
                      </IconButton>
                      <IconButton
                        size='small'
                        sx={{ color: 'text.secondary' }}
                        onClick={() => downloadPassportFunction()}
                      >
                        <Icon icon='tabler:download' />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ m: '0 !important' }} />

                {employeeData?.details?.passport.length > 0 ? (
                  <>
                    <p>
                      {t('Employee.Card_Number')}: {employeeData?.details?.passport[0].cardNumber}
                    </p>
                    <p>
                      {t('Employee.Issued_Place')}: {employeeData?.details?.passport[0]?.issuedPlace}
                    </p>
                    <p>
                      {t('Employee.Issued_Date')}: {employeeData?.details?.passport[0]?.issuedDate}
                    </p>
                    <p>
                      {t('Employee.Expired_Date')}: {employeeData?.details?.passport[0]?.expiredDate}
                    </p>
                  </>
                ) : (
                  <>
                    <p>{t('Employee.Card_Number')}: </p>
                    <p>{t('Employee.Issued_Place')}: </p>
                    <p>{t('Employee.Issued_Date')}: </p>
                    <p>{t('Employee.Expired_Date')}: </p>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
        )}
        {checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE_INSURANCE, PermissionAction.READ) && (
          <Grid sx={{ height: 'auto' }} item xs={12} sm={4} md={4}>
            <Box
              sx={{
                p: 4,
                display: 'flex',
                borderRadius: 1,
                flexDirection: ['column', 'row'],
                justifyContent: ['space-between'],
                backgroundColor: 'white',
                alignItems: ['flex-start', 'center'],
                height: '100%'
              }}
            >
              <Grid sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ color: 'text.primary', fontWeight: 'bold', flexGrow: 1 }}>
                    {t('Employee.Insurance_Document')}
                  </Typography>
                  {checkPermission(
                    PermissionApplication.HRM,
                    PermissionPage.EMPLOYEE_INSURANCE,
                    PermissionAction.WRITE
                  ) && (
                    <Box sx={{ alignItems: 'center', marginRight: '10px' }}>
                      <IconButton
                        size='small'
                        sx={{ color: 'text.secondary' }}
                        onClick={() => handleOpenEditSecurity()}
                      >
                        <Icon icon='tabler:edit' />
                      </IconButton>
                      <IconButton
                        size='small'
                        sx={{ color: 'text.secondary' }}
                        onClick={() => downloadSecurityFunction()}
                      >
                        <Icon icon='tabler:download' />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ m: '0 !important' }} />
                {employeeData?.details?.securities.length > 0 ? (
                  <>
                    <p>
                      {t('Employee.Card_Number')}: {employeeData?.details?.securities[0].cardNumber}
                    </p>
                    <p>
                      {t('Employee.Issued_Place')}: {employeeData?.details?.securities[0]?.issuedPlace}
                    </p>
                    <p>
                      {t('Employee.Issued_Date')}: {employeeData?.details?.securities[0]?.issuedDate}
                    </p>
                    <p>
                      {t('Employee.Expired_Date')}: {employeeData?.details?.securities[0]?.expiredDate}
                    </p>
                  </>
                ) : (
                  <>
                    <p>{t('Employee.Card_Number')}: </p>
                    <p>{t('Employee.Issued_Place')}: </p>
                    <p>{t('Employee.Issued_Date')}: </p>
                    <p>{t('Employee.Expired_Date')}: </p>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
        )}
      </Grid>
      {editOpen && checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE_CIN, PermissionAction.WRITE) && (
        <UpdateCin refetch={refetch} open={editOpen} toggle={toggleEditDrawer} dataParameter={employeeData} />
      )}
      {editOpenPassport &&
        checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE_PASSPORT, PermissionAction.WRITE) && (
          <UpdatePassport
            refetch={refetch}
            open={editOpenPassport}
            toggle={toggleEditPassportDrawer}
            dataParameter={employeeData}
          />
        )}
      {editOpenSecurity &&
        checkPermission(PermissionApplication.HRM, PermissionPage.EMPLOYEE_INSURANCE, PermissionAction.WRITE) && (
          <UpdateSecurity
            refetch={refetch}
            open={editOpenSecurity}
            toggle={toggleEditSecurityDrawer}
            dataParameter={employeeData}
          />
        )}
    </>
  )
}
