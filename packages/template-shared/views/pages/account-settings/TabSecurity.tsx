// ** React Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableContainer from '@mui/material/TableContainer'
import ChangePasswordCard from './security/ChangePasswordCard'
import TwoFactorAuthentication from './security/TwoFactorAuthentication'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { AccountDto } from 'ims-shared/@core/types/ims/accountTypes'
import { useEffect, useState } from 'react'

interface propsType {
  user: AccountDto
  myProfile: boolean
}

const TabSecurity = (props: propsType) => {
  const { t } = useTranslation()
  const { user, myProfile } = props

  const [authType, setUpdateAuthType] = useState<string>('')

  useEffect(() => {
    if (user) {
      setUpdateAuthType(user.authType)
    }
  }, [user])

  const handleUpdateAuthType = (updateAuthType: string) => {
    setUpdateAuthType(updateAuthType)
    user.authType = updateAuthType
  }

  return (
    <>
      {user ? (
        <Grid container spacing={6}>
          {myProfile && authType === 'PWD' ? (
            <Grid item xs={12}>
              <ChangePasswordCard />
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <TwoFactorAuthentication
              myProfile={myProfile}
              user={user}
              authType={authType}
              setUpdateAuthType={handleUpdateAuthType}
            />
          </Grid>

          {/* Recent Devices Card*/}
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t('Security.Recent_Devices')} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}> {t('Security.Browser')}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}> {t('Application.Application')}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}> {t('Security.Device')}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}> {t('Security.Ip_Address')}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}> {t('Security.Recent_Activities')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
                    {user?.connectionTracking?.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              sx={{
                                whiteSpace: 'nowrap',
                                color: 'text.secondary'
                              }}
                            >
                              {row.browser}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              sx={{
                                whiteSpace: 'nowrap',
                                color: 'text.secondary'
                              }}
                            >
                              {row.logApp}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              whiteSpace: 'nowrap',
                              color: 'text.secondary'
                            }}
                          >
                            {row.device}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              whiteSpace: 'nowrap',
                              color: 'text.secondary'
                            }}
                          >
                            {row.ipAddress}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                            {format(new Date(row.loginDate), 'dd-MM-yyyy hh:mm:ss')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      ) : null}
    </>
  )
}

export default TabSecurity
