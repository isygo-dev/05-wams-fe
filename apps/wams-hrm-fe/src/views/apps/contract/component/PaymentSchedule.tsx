import * as React from 'react'
import Box from '@mui/material/Box'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel
} from '@mui/x-data-grid'
import { useMutation, useQuery } from 'react-query'
import { PaymentSchedule } from 'hrm-shared/@core/types/hrm/contractType'
import { useTranslation } from 'react-i18next'
import PaymentScheduleApis from 'hrm-shared/@core/api/hrm/contract/paymentSchedule'

export default function TableEditable({ contractId, checkPermissionUpdatePayment }) {
  const { t } = useTranslation()
  const { data: payments } = useQuery<PaymentSchedule[]>(['PaymentData', contractId], () =>
    PaymentScheduleApis(t).getPaymentScheduleById(contractId)
  )
  const [rows, setRows] = React.useState(payments)
  console.log(payments)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({})

  const mutation = useMutation(PaymentScheduleApis(t).updatePaymentSchedule)

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    })

    const editedRow = rows?.find(row => row.id === id)
    console.log(editedRow)
    setRows(rows?.filter(row => row.id !== id))
  }

  const processRowUpdate = async (newRow: PaymentSchedule) => {
    const data = { ...newRow }
    console.log(data)
    await mutation.mutateAsync(data)
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'ID'
    },
    {
      flex: 0.25,
      minWidth: 200,
      editable: true,
      field: 'dueDate',
      headerName: 'due Date'
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'paymentGrossAmount',
      editable: true,
      headerName: 'Gross Amount'
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'paymentNetAmount',
      editable: true,
      headerName: 'Net Amount'
    },
    {
      flex: 0.15,
      type: 'date',
      minWidth: 130,
      editable: true,
      headerName: 'submit Date',
      field: 'submitDate',
      valueGetter: params => new Date(params.value)
    },
    checkPermissionUpdatePayment && {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main'
              }}
              onClick={checkPermissionUpdatePayment && handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id}
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={checkPermissionUpdatePayment && handleCancelClick(id)}
              color='inherit'
            />
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            key={id}
            label='Edit'
            className='textPrimary'
            onClick={checkPermissionUpdatePayment && handleEditClick(id)}
            color='inherit'
          />
        ]
      }
    }
  ]

  return (
    <Box
      sx={{
        height: 300,
        marginTop: '10px',
        width: '100%',
        '& .actions': {
          color: 'text.secondary'
        },
        '& .textPrimary': {
          color: 'text.primary'
        }
      }}
    >
      <DataGrid
        rows={payments || []}
        columns={columns}
        editMode='row'
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slotProps={{
          toolbar: { setRows, setRowModesModel }
        }}
      />
    </Box>
  )
}
