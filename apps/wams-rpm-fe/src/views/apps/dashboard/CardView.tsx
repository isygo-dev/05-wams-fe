import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import {format} from 'date-fns'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import {Icon} from '@iconify/react'
import CustomChip from 'template-shared/@core/components/mui/chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {ItemType} from 'rpm-shared/@core/types/rpm/itemTypes'
import {StateType} from 'rpm-shared/@core/types/rpm/stateTypes'
import {useTranslation} from 'react-i18next'
import rpmApiUrls from "rpm-shared/configs/rpm_apis";

interface Props {
  selectedWbCode: string
  filteredStates: StateType[]
  filteredItems: ItemType[]
  selectedItem: ItemType
  openAddEventModal: (event, task) => void
  handleClick: (event, task) => void
  setItemWorkFlow: (task) => void
  anchorEl: HTMLElement
  handleCloseMenu: () => void
  handleOpenModal: () => void
}

function CardView(props: Props) {
  const {t} = useTranslation()
  const {
    selectedWbCode,
    filteredStates,
    filteredItems,
    openAddEventModal,
    handleClick,
    setItemWorkFlow,
    anchorEl,
    handleCloseMenu,
    selectedItem,
    handleOpenModal
  } = props

  return (
    <Card className='list-workflow' sx={{width: '100%'}}>
      {selectedWbCode &&
        filteredStates?.map((column, i) => (
          <Grid item md={12} key={i}>
            {filteredItems &&
              filteredItems
                .filter(e => e.state === column.code)
                .map((itemBoard, index) => (
                  <Card
                    key={index}
                    style={{
                      margin: '10px',
                      padding: '20px',
                      borderLeft: '7px solid',
                      borderLeftColor: `${column.color}`
                    }}
                  >
                    <Grid container spacing={12}>
                      <Grid item xs={8} style={{display: 'flex'}}>
                        <div style={{marginRight: '10px'}}>
                          <Avatar
                            src={
                              itemBoard.imagePath
                                ? `${rpmApiUrls.apiUrl_RPM_Resume_ImageDownload_EndPoint}/${itemBoard.id}`
                                : ''
                            }
                            alt={itemBoard.itemName}
                          />
                        </div>
                        <div>
                          <Typography variant='subtitle1' style={{fontWeight: 'bold'}} className='bloc-title-card'>
                            {itemBoard.itemName}
                          </Typography>

                          <Box sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                            <Typography variant='caption' sx={{color: 'text.disabled'}} className='mr-6'>
                              Created date :{format(new Date(itemBoard.createDate), 'dd/MM/yyyy')}
                            </Typography>
                            <Typography variant='caption' sx={{color: 'text.disabled'}}>
                              / Updated date :{format(new Date(itemBoard.updateDate), 'dd/MM/yyyy')}
                            </Typography>
                          </Box>
                        </div>
                      </Grid>
                      <Grid item xs={4} className='p0-mobile'>
                        <div
                          style={{display: 'flex', textAlign: 'right', alignItems: 'center', justifyContent: 'right'}}
                        >
                          {itemBoard.events.map(event => (
                            <Tooltip key={event.id} title={event.title} placement='top'>
                              <IconButton color='primary' onClick={() => openAddEventModal(event, itemBoard)}>
                                <Icon icon='ic:baseline-event'/>
                              </IconButton>
                            </Tooltip>
                          ))}
                          <CustomChip
                            rounded
                            label={itemBoard.state}
                            sx={{backgroundColor: `${column.color}`}}
                            skin='light'
                          />
                          <div>
                            <IconButton
                              aria-label='capture screenshot'
                              color='secondary'
                              size='small'
                              onClick={event => {
                                handleClick(event, itemBoard)
                                setItemWorkFlow(itemBoard)
                              }}
                            >
                              <Icon icon='tabler:dots-vertical'/>
                            </IconButton>

                            <Menu anchorEl={anchorEl} onClose={handleCloseMenu} open={Boolean(anchorEl)}>
                              <MenuItem onClick={() => openAddEventModal(undefined, selectedItem)}>
                                <Icon icon='mdi:event-add' fontSize='25px'/> Add event
                              </MenuItem>
                              <MenuItem onClick={handleOpenModal}>
                                <Icon icon='tabler:edit' fontSize='25px'/> {t('Change')}
                              </MenuItem>
                            </Menu>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
          </Grid>
        ))}
    </Card>
  )
}

export default CardView
