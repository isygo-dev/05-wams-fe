import { addDays, differenceInDays, format } from 'date-fns'

export const getDateRange = (startDate: Date, endDate: Date) => {
  const days = differenceInDays(endDate, startDate)

  return [Array(days + 1).keys()].map(i => format(addDays(startDate, Number(i)), 'MM/dd/yyyy'))
}
