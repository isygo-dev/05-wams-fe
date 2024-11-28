// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import {GridApi} from '@mui/x-data-grid'
import {useTranslation} from 'react-i18next'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'
import {checkPermission} from 'template-shared/@core/api/helper/permission'

interface TableHeaderProps {
    value: string
    toggle: () => void
    handleFilter: (val: string) => void
    dataGridApi: React.RefObject<GridApi>
    viewAdd?: boolean
    permissionApplication?: string
    permissionPage?: string
    permissionAction?: string
}

const TableHeader = (props: TableHeaderProps) => {
    const {t} = useTranslation()

    // ** Props
    const {
        handleFilter,
        toggle,
        value,
        permissionApplication,
        permissionPage,
        permissionAction,
        dataGridApi,
        viewAdd = true
    } = props

    const handleExportClick = () => {
        // Access the exportDataAsCsv function through the DataGrid's API
        dataGridApi.current?.exportDataAsCsv()
    }

    const filterData = (val: string) => {

        dataGridApi.current?.setQuickFilterValues([val])
        handleFilter(val)
    }
    console.log(checkPermission(permissionApplication, permissionPage, permissionAction))

    return (
        <Box
            sx={{
                py: 4,
                px: 6,
                rowGap: 2,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',

                justifyContent: checkPermission(permissionApplication, permissionPage, permissionAction)
                    ? 'space-between'
                    : 'right'
            }}
        >

            {checkPermission(permissionApplication, permissionPage, permissionAction) ? (
                <Button
                    color='primary'
                    onClick={handleExportClick}
                    variant='outlined'
                    startIcon={<Icon icon='tabler:upload'/>}
                >
                    {t('Export')}
                </Button>
            ) : null}

            <Box sx={{rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
                <TextField
                    size='small'
                    value={value}
                    sx={{mr: 4, fontSize: '14px', padding: '7.8px 14px !important'}}
                    placeholder={t('Search') || ''}
                    onChange={e => filterData(e.target.value)}
                />
                {checkPermission(permissionApplication, permissionPage, permissionAction)
                    ? viewAdd && (
                    <Button onClick={toggle} variant='contained' sx={{'& svg': {mr: 2}}}>
                        <Icon fontSize='1.125rem' icon='tabler:plus'/>
                        {t('Action.Add')}
                    </Button>
                )
                    : null}
            </Box>
        </Box>
    )
}

export default TableHeader
