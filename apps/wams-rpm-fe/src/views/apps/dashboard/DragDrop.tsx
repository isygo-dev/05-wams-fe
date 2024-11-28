import React, {MouseEvent, useState} from 'react'
import AddEventDrawer from './AddEventDrawer'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import {useTranslation} from 'react-i18next'
import {Icon} from '@iconify/react'
import {BpmEventRequest, BpmEventResponse, ItemType, MiniBoardEvent} from 'rpm-shared/@core/types/rpm/itemTypes'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import {ToggleButton, ToggleButtonGroup} from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {useTheme} from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useMutation, useQuery} from 'react-query'
import CardView from './CardView'
import GridView from './GridView'
import CardContent from '@mui/material/CardContent'
import WorkflowBoardApis from "rpm-shared/@core/api/rpm/workflow-board";
import WorkflowBoardItemApis from "rpm-shared/@core/api/rpm/workflow-board/item";

function DragDrop() {
  const {t} = useTranslation()
  const theme = useTheme()
  const styles = {
    cardHover: {
      cursor: 'pointer',
      width: '100%',
      '&:hover': {
        border: `1px solid ${theme.palette.primary.dark} !important`
      }
    }
  }

  const {data: wbStore} = useQuery(`wbStore`, () => WorkflowBoardApis(t).getWorkflowBoards())
  const [codeItem, setCodeItem] = useState('')
  const [selectedWbCode, setSelectedWbCode] = useState<string>('')
  const [selectedWbName, setSelectedWbName] = useState<string>('')
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const {data: itemsStore, refetch: refetchItems} = useQuery(
    [`itemsStore`, selectedWbCode],
    () => WorkflowBoardItemApis(t).getWorkflowBoardItems(selectedWbCode),
    {
      enabled: !!selectedWbCode
    }
  )

  const {data: statesStore} = useQuery([`statesStore`, selectedWbCode], () => WorkflowBoardApis(t).getWorkflowBoardStates(selectedWbCode), {
    enabled: !!selectedWbCode
  })

  const [searchQuery, setSearchQuery] = useState('')

  const handleFilter = (query: string) => {
    setSearchQuery(query)
  }

  const updateItemMutation = useMutation({
    mutationFn: (data: BpmEventRequest) => WorkflowBoardItemApis(t).addWorkflowBoardItem(data),
    onSuccess: (res: BpmEventResponse) => {
      if (res.accepted) {
        const index = itemsStore.findIndex(obj => obj.id === res.id)
        if (index !== -1) {
          itemsStore[index].state = res.status
        }
      }
    }
  })

  const onDragEnd = (result: any) => {
    const {source, destination} = result
    if (!destination) return

    if (source.droppableId != destination.droppableId) {
      const index = itemsStore.findIndex(item => item.code == result.draggableId)
      const currentItem = itemsStore[index]
      const updatedItem: BpmEventRequest = {
        item: currentItem,
        wbCode: selectedWbCode,
        fromState: source.droppableId,
        toState: destination.droppableId
      }
      updateItemMutation.mutate(updatedItem)
    }
  }

  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(preViewMode => (preViewMode === 'auto' ? 'grid' : 'card'))
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(preViewMode => (preViewMode === 'auto' ? 'card' : 'grid'))
    } else setViewMode(preViewMode => (preViewMode === 'grid' ? 'card' : 'grid'))
  }

  const [viewMode, setViewMode] = useState('auto')

  const [show, setShow] = useState<boolean>(false)
  const [openAddEventDialog, setOpenAddEventDialog] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<ItemType>(null)
  const [selectedEvent, setSelectedEvent] = useState<MiniBoardEvent | undefined>()
  const [newSelectState, setNewSelectState] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleCloseModal = () => setShow(false)

  const closeAddEventModal = () => {
    setOpenAddEventDialog(false)
    refetchItems()
  }

  const openAddEventModal = (event: MiniBoardEvent | undefined, item: ItemType) => {
    console.log('event', event)
    console.log('item', item)
    setSelectedEvent(event)
    setSelectedItem(item)
    setOpenAddEventDialog(true)
    handleCloseMenu()
  }

  const handleOpenModal = () => {
    setShow(true)
    handleCloseMenu()
  }

  const handleSelectNewState = (event: MouseEvent<HTMLElement>, newState: string) => {
    if (newState !== null) {
      event.preventDefault()
      setNewSelectState(newState)
    }
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>, itemType: ItemType) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem(itemType)
  }

  const setItemWorkFlow = (itemType: ItemType) => {
    setCodeItem(itemType.code)
    console.log('codeItem', codeItem)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSaveState = () => {
    if (newSelectState && selectedItem.state !== newSelectState) {
      const updatedItem: BpmEventRequest = {
        item: selectedItem,
        wbCode: selectedWbCode,
        fromState: selectedItem.state,
        toState: newSelectState
      }
      updateItemMutation.mutate(updatedItem)
    }
    handleCloseModal()
  }

  const renderViewBasedOnMode = () => {
    if (isMobile && viewMode === 'auto') {
      return cardView
    } else if (!isMobile && viewMode === 'auto') {
      return gridView
    } else if (viewMode === 'grid') {
      return gridView
    } else if (viewMode === 'card') {
      return cardView
    }
  }

  const filteredItems = itemsStore?.filter(
    task =>
      task.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.state && task.state.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const filteredStates = statesStore?.filter(state => state.wbCode === selectedWbCode)

  const handleSelectedWbChange = (event: string) => {
    console.log('selectedWbName')
    const item = wbStore?.find(obj => {
      return obj.code === event
    })
    setSelectedWbCode(event)
    setSelectedWbName(item?.name)
  }

  const gridView = (
    <GridView
      openAddEventModal={openAddEventModal}
      onDragEnd={onDragEnd}
      filteredStates={filteredStates}
      filteredItems={filteredItems}
    ></GridView>
  )

  const cardView = (
    <CardView
      selectedWbCode={selectedWbCode}
      selectedItem={selectedItem}
      filteredItems={filteredItems}
      filteredStates={filteredStates}
      handleCloseMenu={handleCloseMenu}
      handleOpenModal={handleOpenModal}
      openAddEventModal={openAddEventModal}
      setItemWorkFlow={setItemWorkFlow}
      handleClick={handleClick}
      anchorEl={anchorEl}
    />
  )

  return (
    <Grid>
      <Card sx={{width: '100%', padding: '20px 10px'}}>
        <Grid container spacing={3} justifyContent={'center'}>
          {wbStore?.map((wb, index) => (
            <Grid item xs={12} md={2.4} sm={6} key={index}>
              <Card
                sx={{
                  border: selectedWbName === wb.name ? `1px solid ${theme.palette.primary.main}` : '',

                  '&:hover': {
                    border: `1px solid ${theme.palette.primary.light}`,
                    transform: ' translateY(-10px)'
                  }
                }}
                onClick={() => handleSelectedWbChange(wb.code)}
                style={styles.cardHover}
              >
                <CardContent>
                  <Box textAlign={'center'} display={'block'}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='2.5em' height='2.5em' viewBox='0 0 24 24'>
                      <path
                        fill='none'
                        stroke='currentColor'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='2'
                        d='M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1m0 12h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1m10-4h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1m0-8h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1'
                      />
                    </svg>
                    <Typography variant={'subtitle1'}>{wb.name} </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
      <Grid container mt={2}>
        <Card sx={{width: '100%', padding: '10px'}}>
          <Grid item md={12} sm={12} xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6} md={6} sm={6} className={'changeAlign'}>
                <ToggleButtonGroup exclusive value={viewMode} onChange={toggleViewMode} aria-label='text alignment'>
                  <ToggleButton value='grid' aria-label='left aligned'>
                    <Icon icon='ic:baseline-view-list' fontSize='1.375rem'/>
                  </ToggleButton>
                  <ToggleButton value='card' aria-label='center aligned'>
                    <Icon icon='ic:baseline-view-module' fontSize='1.375rem'/>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item md={6} sm={6} xs={6} className={'changeAlignText'}>
                <TextField size='small' placeholder='Search' onChange={e => handleFilter(e.target.value)}/>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        {renderViewBasedOnMode()}
        {show ? (
          <Dialog
            fullWidth
            disableEscapeKeyDown
            open={show}
            maxWidth='xs'
            scroll='body'
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                handleCloseModal()
              }
            }}
          >
            <DialogContent
              sx={{
                position: 'relative',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Box sx={{mb: 4, textAlign: 'center'}}>
                <Typography variant='h5' sx={{mb: 3}}>
                  {t('Change state')}
                </Typography>
              </Box>
              <Box sx={{textAlign: 'center'}}>
                <ToggleButtonGroup
                  className='toggle-selected'
                  orientation='vertical'
                  exclusive
                  value={newSelectState}
                  onChange={handleSelectNewState}
                >
                  {filteredStates.map(column => (
                    <ToggleButton
                      key={column.id}
                      value={column.code}
                      style={{padding: '0px'}}
                      className={`${selectedItem.state === column.code ? 'bg-selected-state' : 'bg-state'}`}
                    >
                      <Button style={{color: 'inherit'}}>{column.name}</Button>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
              <Button onClick={handleCloseModal}>{t('Cancel')}</Button>
              <Button variant='contained' onClick={handleSaveState}>
                {t('Save')}
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}

        {openAddEventDialog && (
          <AddEventDrawer
            open={openAddEventDialog}
            setClose={closeAddEventModal}
            event={selectedEvent}
            item={selectedItem}
            boardCode={selectedWbCode}
          />
        )}
      </Grid>
    </Grid>
  )
}

export default DragDrop
