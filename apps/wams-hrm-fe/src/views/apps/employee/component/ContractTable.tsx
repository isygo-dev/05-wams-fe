import React, {useContext} from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import {useTranslation} from 'react-i18next'
import {EmployeeContext} from '../../../../pages/apps/employee/view/[id]'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Link from 'next/link'

const ContractTable = () => {
  const {t} = useTranslation()
  const employee = useContext(EmployeeContext)
  const employeeData = employee.employeeData
  const formatDate = date => {
    return date.toLocaleDateString('en-GB') // Modify locale based on your requirements
  }

  return (
    <TableContainer component={Paper} sx={{mt: 5}}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>{t('Contract.Contract_Type')}</TableCell>
            <TableCell>{t('Contract.availability')}</TableCell>
            <TableCell>{t('Contract.start_Date')}</TableCell>
            <TableCell>{t('Contract.End_Date')}</TableCell>
            <TableCell>{t('Actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employeeData.contracts.map(row => (
            <TableRow
              key={row.name}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell>{row.contract}</TableCell>
              <TableCell>{row.availability}</TableCell>
              <TableCell>{formatDate(new Date(row.startDate))}</TableCell>
              <TableCell>{formatDate(new Date(row.endDate))}</TableCell>
              <TableCell>
                <IconButton
                  size='small'
                  component={Link}
                  sx={{color: 'text.secondary'}}
                  href={`/apps/contract/view/${row.id}`}
                >
                  <Icon icon='fluent:slide-text-edit-24-regular'/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ContractTable
