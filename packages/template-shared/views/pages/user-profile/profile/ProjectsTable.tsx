// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AvatarGroup from '@mui/material/AvatarGroup'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

// ** Third Party Imports
import axios from 'axios'

// ** Types Imports
import { ThemeColor } from 'template-shared/@core/layouts/types'
import { ProjectTableRowType } from 'template-shared/@fake-db/types'

// ** Custom Components Imports
import OptionsMenu from 'template-shared/@core/components/option-menu'
import CustomAvatar from 'template-shared/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'template-shared/@core/utils/get-initials'

interface CellType {
  row: ProjectTableRowType
}

// ** renders name column
const renderName = (row: ProjectTableRowType) => {
  if (row.avatar) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem' }}
        color={(row.avatarColor as ThemeColor) || ('primary' as ThemeColor)}
      >
        {getInitials(row.name || 'John Doe')}
      </CustomAvatar>
    )
  }
}

const columns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'name',
    minWidth: 220,
    headerName: 'Name',
    renderCell: ({ row }: CellType) => {
      const { name, date } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderName(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' /* , textTransform: 'capitalize' */ }}>
              {date}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 105,
    field: 'leader',
    headerName: 'Leader',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.leader}</Typography>
  },
  {
    flex: 0.1,
    field: 'team',
    minWidth: 130,
    headerName: 'Team',
    renderCell: ({ row }: CellType) => (
      <AvatarGroup className='pull-up'>
        {row.avatarGroup.map((src, index) => (
          <CustomAvatar key={index} src={src} sx={{ height: 26, width: 26 }} />
        ))}
      </AvatarGroup>
    )
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => (
      <>
        <LinearProgress
          color='primary'
          value={row.status}
          variant='determinate'
          sx={{ mr: 3, height: 8, width: '100%' }}
        />
        <Typography sx={{ color: 'text.secondary' }}>{`${row.status}%`}</Typography>
      </>
    )
  },

  {
    flex: 0.1,
    minWidth: 100,
    field: 'actions',
    headerName: 'Actions',
    renderCell: () => (
      <OptionsMenu
        iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
        options={[
          'Details',
          'Archive',
          { divider: true },
          { text: 'Delete', menuItemProps: { sx: { color: 'error.main' } } }
        ]}
      />
    )
  }
]

const ProfileTable = () => {
  // ** State
  const [data, setData] = useState([])
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  useEffect(() => {
    axios.get('/pages/profile-table', { params: { q: value } }).then(response => {
      setData(response.data)
    })
  }, [value])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  return data ? (
    <Card>
      <CardHeader
        title='Projects'
        action={
          <TextField
            size='small'
            value={value}
            placeholder='Search Project'
            onChange={e => handleFilter(e.target.value)}
          />
        }
      />
      <DataGrid
        autoHeight
        pagination
        rows={data}
        rowHeight={60}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        pageSizeOptions={[5, 7, 10]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  ) : null
}

export default ProfileTable
