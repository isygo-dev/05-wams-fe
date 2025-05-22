// ** React Imports
//import {forwardRef} from 'react'

// ** Next Import
//import Link from 'next/link'

// ** MUI Imports
// import Box from '@mui/material/Box'
// import Tooltip from '@mui/material/Tooltip'
// import {styled} from '@mui/material/styles'
// import TextField from '@mui/material/TextField'
// import Typography from '@mui/material/Typography'
// import {GridColDef} from '@mui/x-data-grid'

// ** Icon Imports
//import Icon from 'template-shared/@core/components/icon'

// ** Third Party Imports
//import format from 'date-fns/format'

// ** Store & Actions Imports
// ** Types Imports
//import {ThemeColor} from 'template-shared/@core/layouts/types'
// import {InvoiceType} from '../../../../types/apps/invoiceTypes'
//
// // ** Utils Import
// import {getInitials} from 'template-shared/@core/utils/get-initials'
//
// // ** Custom Components Imports
// import CustomChip from 'template-shared/@core/components/mui/chip'
// import CustomAvatar from 'template-shared/@core/components/mui/avatar'
//
// interface InvoiceStatusObj {
//     [key: string]: {
//         icon: string
//         color: ThemeColor
//     }
// }

// interface CustomInputProps {
//     dates: Date[]
//     label: string
//     end: number | Date
//     start: number | Date
//     setDates?: (value: Date[]) => void
// }
//
// interface CellType {
//     row: InvoiceType
// }
//
// // ** Styled component for the link in the dataTable
// const LinkStyled = styled(Link)(({theme}) => ({
//     fontSize: '1rem',
//     textDecoration: 'none',
//     color: theme.palette.primary.main
// }))
//
// // ** Vars
// const invoiceStatusObj: InvoiceStatusObj = {
//     Paid: {color: 'success', icon: 'tabler:circle-half-2'},
//     Sent: {color: 'secondary', icon: 'tabler:circle-check'},
//     Draft: {color: 'primary', icon: 'tabler:device-floppy'},
//     'Past Due': {color: 'error', icon: 'tabler:alert-circle'},
//     Downloaded: {color: 'info', icon: 'tabler:arrow-down-circle'},
//     'Partial Payment': {color: 'warning', icon: 'tabler:chart-pie'}
// }
//
// // ** renders client column
// const renderClient = (row: InvoiceType) => {
//     if (row.avatar.length) {
//         return <CustomAvatar src={row.avatar} sx={{mr: 2.5, width: 38, height: 38}}/>
//     } else {
//         return (
//             <CustomAvatar
//                 skin='light'
//                 color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
//                 sx={{mr: 2.5, fontWeight: 500, fontSize: '1rem', width: 38, height: 38}}
//             >
//                 {getInitials(row.name || 'John Doe')}
//             </CustomAvatar>
//         )
//     }
// }

// const defaultColumns: GridColDef[] = [
//     {
//         flex: 0.1,
//         field: 'id',
//         minWidth: 100,
//         headerName: '#',
//         renderCell: ({row}: CellType) => <LinkStyled
//             href={`/apps/invoice/preview/${row.id}`}>{`#${row.id}`}</LinkStyled>
//     },
//     {
//         flex: 0.1,
//         minWidth: 80,
//         field: 'invoiceStatus',
//         renderHeader: () => <Icon fontSize='1.125rem' icon='tabler:trending-up'/>,
//         renderCell: ({row}: CellType) => {
//             const {dueDate, balance, invoiceStatus} = row
//
//             const color = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].color : 'primary'
//
//             return (
//                 <Tooltip
//                     title={
//                         <div>
//                             <Typography variant='caption' sx={{color: 'common.white', fontWeight: 600}}>
//                                 {invoiceStatus}
//                             </Typography>
//                             <br/>
//                             <Typography variant='caption' sx={{color: 'common.white', fontWeight: 600}}>
//                                 Balance:
//                             </Typography>{' '}
//                             {balance}
//                             <br/>
//                             <Typography variant='caption' sx={{color: 'common.white', fontWeight: 600}}>
//                                 Due Date:
//                             </Typography>{' '}
//                             {dueDate}
//                         </div>
//                     }
//                 >
//                     <CustomAvatar skin='light' color={color} sx={{width: '1.875rem', height: '1.875rem'}}>
//                         <Icon icon={invoiceStatusObj[invoiceStatus].icon}/>
//                     </CustomAvatar>
//                 </Tooltip>
//             )
//         }
//     },
//     {
//         flex: 0.25,
//         field: 'name',
//         minWidth: 320,
//         headerName: 'Client',
//         renderCell: ({row}: CellType) => {
//             const {name, companyEmail} = row
//
//             return (
//                 <Box sx={{display: 'flex', alignItems: 'center'}}>
//                     {renderClient(row)}
//                     <Box sx={{display: 'flex', flexDirection: 'column'}}>
//                         <Typography noWrap sx={{color: 'text.secondary', fontWeight: 500}}>
//                             {name}
//                         </Typography>
//                         <Typography noWrap variant='body2' sx={{color: 'text.disabled'}}>
//                             {companyEmail}
//                         </Typography>
//                     </Box>
//                 </Box>
//             )
//         }
//     },
//     {
//         flex: 0.1,
//         minWidth: 100,
//         field: 'total',
//         headerName: 'Total',
//         renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{`$${row.total || 0}`}</Typography>
//     },
//     {
//         flex: 0.15,
//         minWidth: 140,
//         field: 'issuedDate',
//         headerName: 'Issued Date',
//         renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.issuedDate}</Typography>
//     },
//     {
//         flex: 0.1,
//         minWidth: 100,
//         field: 'balance',
//         headerName: 'Balance',
//         renderCell: ({row}: CellType) => {
//             return row.balance !== 0 ? (
//                 <Typography sx={{color: 'text.secondary'}}>{row.balance}</Typography>
//             ) : (
//                 <CustomChip rounded size='small' skin='light' color='success' label='Paid'/>
//             )
//         }
//     }
// ]
//
// /* eslint-disable */
// const CustomInput = forwardRef((props: CustomInputProps, ref) => {
//     const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
//     const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
//
//     const value = `${startDate}${endDate !== null ? endDate : ''}`
//     props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
//     const updatedProps = {...props}
//     delete updatedProps.setDates
//
//     return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value}/>
// })
/* eslint-enable */

const BillingHistoryTable = () => {
  /*
      // ** State
      const [value, setValue] = useState<string>('')
      const [statusValue, setStatusValue] = useState<string>('')
      const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})

      // ** Hooks
      const dispatch = useDispatch<AppDispatch>()
      const store = useSelector((state: RootState) => state.invoice)

      useEffect(() => {
        dispatch(
          fetchData({
            q: value,
            status: statusValue
          })
        )
      }, [dispatch, statusValue, value])

      const handleFilter = (val: string) => {
        setValue(val)
      }

      const handleStatusValue = (e: SelectChangeEvent) => {
        setStatusValue(e.target.value)
      }

      const columns: GridColDef[] = [
        ...defaultColumns,
        {
          flex: 0.1,
          minWidth: 140,
          sortable: false,
          field: 'actions',
          headerName: 'Actions',
          renderCell: ({row}: CellType) => (
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Tooltip title='Delete Invoice'>
                <IconButton size='small' onClick={() => dispatch(deleteInvoice(row.id))}>
                  <Icon icon='tabler:trash'/>
                </IconButton>
              </Tooltip>
              <Tooltip title= {t('Action.Edit')}>
                <IconButton size='small' component={Link} href={`/apps/invoice/preview/${row.id}`}>
                  <Icon icon='fluent:slide-text-edit-24-regular'/>
                </IconButton>
              </Tooltip>
              <OptionsMenu
                iconButtonProps={{size: 'small'}}
                menuProps={{sx: {'& .MuiMenuItem-root svg': {mr: 2}}}}
                options={[
                  {
                    text: 'Download',
                    icon: <Icon icon='tabler:download' fontSize={20}/>
                  },
                  {
                    text: 'Edit',
                    href: `/apps/invoice/edit/${row.id}`,
                    icon: <Icon icon='tabler:edit' fontSize={20}/>
                  },
                  {
                    text: 'Duplicate',
                    icon: <Icon icon='tabler:copy' fontSize={20}/>
                  }
                ]}
              />
            </Box>
          )
        }
      ]

      return (
        <Card>
          <CardHeader title='Billing History'/>
          <CardContent sx={{pb: 4}}>
            <Box
              sx={{
                gap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button component={Link} variant='contained' href='/apps/invoice/add' sx={{'& svg': {mr: 2}}}>
                <Icon fontSize='1.125rem' icon='tabler:plus'/>
                Create Invoice
              </Button>
              <Box
                sx={{
                  gap: 4,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <TextField
                  size='small'
                  value={value}
                  placeholder='Search Invoice'
                  onChange={e => handleFilter(e.target.value)}
                />
                <FormControl size='small'>
                  <InputLabel id='invoice-status-select'>Invoice Status</InputLabel>
                  <Select
                    sx={{pr: 4}}
                    value={statusValue}
                    label='Invoice Status'
                    onChange={handleStatusValue}
                    labelId='invoice-status-select'
                  >
                    <MenuItem value=''>none</MenuItem>
                    <MenuItem value='downloaded'>Downloaded</MenuItem>
                    <MenuItem value='draft'>Draft</MenuItem>
                    <MenuItem value='paid'>Paid</MenuItem>
                    <MenuItem value='partial payment'>Partial Payment</MenuItem>
                    <MenuItem value='past due'>Past Due</MenuItem>
                    <MenuItem value='sent'>Sent</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </CardContent>
          <DataGrid
            autoHeight
            pagination
            rows={store.data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      )
      */
}

export default BillingHistoryTable
