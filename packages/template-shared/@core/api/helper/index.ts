export const isTimeAfterHours = (time: any, hours: number) => {
  const dateToDay: Date = new Date()
  const datePost: Date = new Date(time)
  const timeDifference = dateToDay.getTime() - new Date(datePost).getTime()
  const hoursDifference = timeDifference / (1000 * 60 * 60) // Convert milliseconds to hours

  return hoursDifference <= hours
}
