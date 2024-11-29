import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, {TimelineProps} from '@mui/lab/Timeline'
import {styled} from '@mui/material/styles'
import {useQuery} from 'react-query'
import {ResumeTypes} from 'rpm-shared/@core/types/rpm/ResumeTypes'
import {timelineType} from 'rpm-shared/@core/types/rpm/timelineTypes'
import TimeLineApis from "rpm-shared/@core/api/rpm/timeline";
import {useTranslation} from "react-i18next";

const ViewTimeline = styled(MuiTimeline)<TimelineProps>({
    paddingLeft: 0,
    paddingRight: 0,
    '& .MuiTimelineItem-root': {
        width: '100%',
        '&:before': {
            display: 'none'
        }
    }
})

type TimeProps = {
    resume: ResumeTypes
}
const formatDate = (date: any) => {
    const formattedDate = new Date(date)
    const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'numeric', day: 'numeric'}

    return formattedDate.toLocaleDateString('en-US', options)
}
const formatTime = (date: any) => {
    const formattedTime = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric'
    }

    return formattedTime.toLocaleTimeString('en-US', options)
}
const TimelineLeft: React.FC<TimeProps> = props => {
    const {t} = useTranslation()
    const {resume} = props
    const {data: timelinedata} = useQuery<timelineType[]>('timeline', () => TimeLineApis(t).findTimeline(resume), {})
    const getTimelineDotColor = (action: 'PERSIST' | 'UPDATE' | 'REMOVE') => {
        if (action === 'PERSIST') {
            return 'error'
        } else if (action === 'UPDATE') {
            return 'primary'
        } else {
            return 'warning'
        }
    }
    const getTimelineAction = (action: 'PERSIST' | 'UPDATE' | 'REMOVE') => {
        if (action === 'PERSIST') {
            return 'Created'
        } else if (action === 'UPDATE') {
            return 'Updated'
        } else {
            return 'Deleted'
        }
    }

    return (
        <ViewTimeline>
            {timelinedata?.map(item => (
                <TimelineItem key={item.id}>
                    <TimelineSeparator>
                        <TimelineDot color={getTimelineDotColor(item.action)}/>
                        <TimelineConnector/>
                    </TimelineSeparator>
                    <TimelineContent>
                        <Box
                            sx={{
                                mb: 2,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography variant='body2' sx={{mr: 2, fontWeight: 600, color: 'text.primary'}}>
                                {getTimelineAction(item.action)}
                            </Typography>
                            <Typography variant='caption'>
                                {item.action === 'PERSIST' ? ` ${formatDate(item.createDate)} ` : ` ${formatDate(item.updateDate)} `}
                            </Typography>
                        </Box>
                        <Typography variant='body2' sx={{display: 'flex', flexWrap: 'wrap'}}>
                            <span>Indicate the action details</span> <span>(Not implemeted yet)</span>
                        </Typography>
                        <Typography variant='caption'>
                            {item.action === 'PERSIST' ? ` ${formatTime(item.createDate)} ` : ` ${formatTime(item.updateDate)} `}
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </ViewTimeline>
    )
}

export default TimelineLeft
