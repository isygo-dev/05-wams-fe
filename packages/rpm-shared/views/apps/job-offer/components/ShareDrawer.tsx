import React, { ReactNode, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem, { ListItemProps } from '@mui/material/ListItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import PerfectScrollbar from 'react-perfect-scrollbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import imsApiUrls from 'ims-shared/configs/ims_apis'
import { useAuth } from 'template-shared/hooks/useAuth'
import { useMutation, useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import AccountApis from 'ims-shared/@core/api/ims/account'
import JobOfferApis from 'rpm-shared/@core/api/rpm/job-offer'
import { MinAccountDto, ShareJobRequestDto } from 'ims-shared/@core/types/ims/accountTypes'
import { JobOfferType } from 'rpm-shared/@core/types/rpm/jobOfferTypes'

const ShareItem = styled(ListItem)<ListItemProps>(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: theme.spacing(2.25),
  paddingBottom: theme.spacing(2.25),
  justifyContent: 'space-between',
  transition: 'border 0.15s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  '&:not(:first-child)': {
    borderTop: `1px solid ${theme.palette.divider}`
  },
  '&:hover': {
    zIndex: 2,
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)',
    '& .mail-actions': { display: 'flex' },
    '& .mail-info-right': { display: 'none' },
    '& + .MuiListItem-root': { borderColor: 'transparent' }
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5)
  },
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5)
  }
}))

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  job: JobOfferType
  setJob: (val: ShareJobRequestDto[]) => void
}

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}
const ShareJobDrawer = (props: Props) => {
  const { t } = useTranslation()
  const { open, setOpen, job, setJob } = props
  const [checked, setChecked] = useState<MinAccountDto[]>([])
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const auth = useAuth()
  const { data: accounts } = useQuery(`accounts`, () => AccountApis(t).getAccountDetails())
  const [filteredData, setFilteredData] = useState<MinAccountDto[]>([])

  useEffect(() => {
    if (job && accounts) {
      setChecked(
        accounts?.filter(
          miniAccount => job?.jobShareInfos?.some(jobShareInfos => jobShareInfos.sharedWith === miniAccount.code)
        )
      )
      setFilteredData([...accounts])
    }
  }, [accounts, job])

  const handleClose = () => setOpen(false)

  const shareJobMutation = useMutation({
    mutationFn: (newMutation: { id: number; request: ShareJobRequestDto }) =>
      JobOfferApis(t).shareJobOffer(newMutation),
    onSuccess: res => {
      if (res) {
        setJob(res)
      }
      handleClose()
    }
  })
  const submit = async () => {
    const requestData: ShareJobRequestDto = { jobOwner: auth.user?.firstName + '', accountsCode: checked }
    shareJobMutation.mutate({ id: job.id, request: requestData })
    handleClose()
  }
  const toggelAll = () => {
    if (checked.length == accounts.length) {
      setChecked([])
    } else {
      setChecked([...accounts])
    }
  }

  const handleToggle = (value: MinAccountDto) => () => {
    let newChecked = [...checked]
    const isApplicationSelected = checked.some(acc => acc.code === value.code)
    if (!isApplicationSelected) {
      newChecked.push(value)
    } else {
      newChecked = newChecked.filter(e => e.code !== value.code)
    }
    setChecked(newChecked)
  }

  const isChecked = (account: MinAccountDto): boolean => {
    return checked.some(acc => acc.code === account.code)
  }

  const filterChange = e => {
    if (e.target?.value && e.target?.value.toString().trim().length > 0) {
      setFilteredData([
        ...accounts.filter(
          acc =>
            acc.fullName.toLowerCase().includes(e.target?.value.toString().trim().toLowerCase()) ||
            acc.email.toLowerCase().includes(e.target?.value.toString().trim().toLowerCase())
        )
      ])
    } else {
      setFilteredData([...accounts])
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth={'sm'}
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>Share Job</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText id='alert-dialog-description'>
          <Box sx={{ p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 7.625rem)' }}>
            <TextField size='small' placeholder='Search' type='search' fullWidth onChange={filterChange} />
            <ScrollWrapper hidden={hidden}>
              <List>
                {filteredData.map((account: MinAccountDto) => {
                  return (
                    <ShareItem key={account.id} sx={{ backgroundColor: 'background.paper' }}>
                      <Box sx={{ mr: 4, display: 'flex', overflow: 'hidden', alignItems: 'center' }}>
                        <Checkbox onClick={handleToggle(account)} checked={isChecked(account)} />
                        <Avatar
                          alt={account.fullName}
                          src={`${imsApiUrls.apiUrl_IMS_Account_ImageDownload_EndPoint}/${account.id}`}
                          sx={{ mr: 3, width: '2rem', height: '2rem' }}
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            overflow: 'hidden',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' }
                          }}
                        >
                          <ListItemText primary={account.fullName} secondary={account.email} />
                        </Box>
                      </Box>
                    </ShareItem>
                  )
                })}
              </List>
            </ScrollWrapper>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense' sx={{ justifyContent: 'space-between' }}>
        <Button onClick={toggelAll}>{checked.length == accounts?.length ? 'Uncheck all' : 'Check all'}</Button>
        <Button onClick={submit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShareJobDrawer
