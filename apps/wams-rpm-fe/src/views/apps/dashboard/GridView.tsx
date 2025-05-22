import React from 'react'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import DummyCard from './DummyCard'
import { StateType } from 'rpm-shared/@core/types/rpm/stateTypes'
import { ItemType } from 'rpm-shared/@core/types/rpm/itemTypes'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

interface Props {
  filteredStates: StateType[]
  filteredItems: ItemType[]
  onDragEnd: (result) => void

  openAddEventModal: (event, task) => void
}

function GridView(props: Props) {
  const { filteredStates, onDragEnd, filteredItems, openAddEventModal } = props

  return (
    <Card className='bloc-list-workflow' style={{ margin: '20px 0', width: '100%' }}>
      <Box
        style={{ height: ' max-content' }}
        sx={{
          border: 0,
          boxShadow: 0,
          color: 'inherit',
          display: 'flex',
          margin: '16px'
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {filteredStates?.map((column, i) => (
            <Droppable key={i} droppableId={column.code} sx={{ gap: 2 }}>
              {provided => (
                <div className='bloc-workflow' {...provided.droppableProps} ref={provided.innerRef}>
                  <Card className='center-sticky'>
                    <h2 className='bloc-title'>{column.name}</h2>
                  </Card>
                  {filteredItems &&
                    filteredItems
                      .filter(e => e.state === column.code)
                      .map((card, index) => (
                        <Draggable key={card.id} draggableId={card.code} index={index}>
                          {(provided: any) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              style={{
                                userSelect: 'none',
                                ...provided.draggableProps.style
                              }}
                              className='bloc-workflow-card'
                            >
                              <DummyCard data={card} color={column.color} openAddEvent={openAddEventModal} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Box>
    </Card>
  )
}

export default GridView
