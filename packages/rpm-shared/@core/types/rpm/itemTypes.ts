export type ItemType = {
  id?: number
  code: string
  state: string
  itemName: string
  imagePath: string
  createDate: Date
  updateDate: Date
  events: MiniBoardEvent[]
  itemImage: string
}

export type BoardEvent = {
  type: string
  calendar: string
  eventCode: string
  participants: string[]
}

export type MiniBoardEvent = {
  id?: number
  type: string
  title: string
}

export type BpmEventRequest = {
  item: ItemType
  wbCode: string
  fromState: string
  toState: string
}

export type BpmEventResponse = {
  accepted: boolean
  status: string
  id: number
}
