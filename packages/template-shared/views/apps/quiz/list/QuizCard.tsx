import Box from '@mui/material/Box'
import React, {useState} from 'react'
import {QuizType} from 'quiz-shared/@core/types/quiz/quizTypes'
import {useTranslation} from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Link from 'next/link'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CustomChip from 'template-shared/@core/components/mui/chip'

import {format} from 'date-fns'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import process from 'process'
import Styles from "../../../../style/style.module.css";

interface CardItem {
    data: QuizType
    onDeleteClick: (rowId: number) => void
    onPlayQuiz: (item: QuizType) => void
    onDeleteCandidateQuizClick: (code: string) => void
    quizCandidate: any
}

const QuizCard = (props: CardItem) => {
    const {t} = useTranslation()
    const {data, onDeleteClick, onPlayQuiz, onDeleteCandidateQuizClick, quizCandidate} = props
    const [appName] = useState<string>(process.env.NEXT_PUBLIC_APP_NAME)
    const score = data.scale !== 0 ? Math.floor((data.score / data.scale) * 100) : null

    return (
        <Card sx={{position: 'relative', height: '100%'}}>
            <CardHeader
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    padding: 'initial',
                    '& .MuiCardHeader-avatar': {mr: 2}
                }}
                subheader={
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'flex-end'
                        }}
                    ></Box>
                }
                action={
                    <>
                        {(() => {
                            const foundCQ =
                                quizCandidate.length > 0 &&
                                quizCandidate.find(candidate => candidate.quizCode === data.code && candidate.startDate !== null)

                            const candidateQuizExist = !!foundCQ

                            return (
                                <Box sx={{display: 'flex', alignItems: 'flex-end', padding: '.05rem'}}>
                                    <Tooltip title={t('Action.Delete') as string}>
                                        <IconButton onClick={() => onDeleteClick(data.id)} className={Styles.sizeIcon}
                                                    size='small'
                                                    sx={{color: 'text.secondary'}}>
                                            <Icon icon='tabler:trash'/>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title={t('Quiz.Play_Quiz') as string}>
                                        <IconButton size='small' sx={{color: 'text.secondary'}}
                                                    className={Styles.sizeIcon}
                                                    onClick={() => onPlayQuiz(data)}>
                                            <Icon icon='tabler:play'/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t('Action.Edit')}>
                                        <IconButton
                                            size='small'
                                            component={Link}
                                            sx={{color: 'text.secondary'}} className={Styles.sizeIcon}
                                            href={`/apps/quiz/view/QuizView/${data.id}`}
                                        >
                                            <Icon icon='fluent:slide-text-edit-24-regular'/>
                                        </IconButton>
                                    </Tooltip>
                                    {candidateQuizExist ? (
                                        <Tooltip title='reset'>
                                            <IconButton
                                                size='small'
                                                sx={{color: 'text.secondary'}}
                                                className={Styles.sizeIcon}
                                                onClick={() => onDeleteCandidateQuizClick(data.code)}
                                            >
                                                <Icon icon='mynaui:undo'/>
                                            </IconButton>
                                        </Tooltip>
                                    ) : null}
                                </Box>
                            )
                        })()}
                    </>
                }
            />
            <Divider className={Styles.dividerStyle}/>
            <CardContent sx={{pb: '1px'}} className={Styles.cardContentStyle}>
                <Typography className={Styles.cardTitle} variant='h6'>
                    {data.name}
                </Typography>
                <Typography sx={{color: 'text.secondary', fontSize: '.8rem'}}>
                    {data.code}
                </Typography>
                <Typography sx={{color: 'text.secondary'}}>
                    <Typography component='span' sx={{fontWeight: 500, fontSize: '.8rem'}}>
                        {t('Category')} :
                    </Typography>{' '}
                    {data.category}
                </Typography>
                <Typography sx={{color: 'text.secondary'}}>
                    <Typography component='span' sx={{fontWeight: 500, fontSize: '.8rem'}}>
                        {t('Tags')} :
                    </Typography>{' '}
                    {data?.tags &&
                        data.tags.map((tag, index) => (
                            <Box
                                className='keen-slider__slide'
                                href='/'
                                key={index}
                                component={Link}
                                onClick={e => e.preventDefault()}
                                sx={{
                                    '& .MuiChip-root': {cursor: 'pointer'}
                                }}
                            >
                                {' '}
                                <CustomChip rounded size='small' skin='light' label={tag}/>
                            </Box>
                        ))}
                </Typography>


            </CardContent>
            {appName === 'webapp-cfo' && (
                <CardContent>
                    {data.startDate && (
                        <Box sx={{display: 'flex'}}>
                            <Typography
                                sx={{mr: 1, fontWeight: 500, fontSize: '.8rem'}}>{t('Quiz.Start_Date')} : </Typography>
                            <Typography sx={{color: 'text.secondary', fontSize: '.8rem'}}>
                                {' '}
                                {format(new Date(data.startDate), 'yy-MM-dd HH:mm')}
                            </Typography>
                        </Box>
                    )}
                    {data.submitDate && (
                        <Box sx={{display: 'flex'}}>
                            <Typography
                                sx={{mr: 1, fontWeight: 500, fontSize: '.8rem'}}>{t('Quiz.Submit_Date')} : </Typography>
                            <Typography sx={{color: 'text.secondary', fontSize: '.8rem'}}>
                                {format(new Date(data.submitDate), 'yy-MM-dd HH:mm')}
                            </Typography>
                        </Box>
                    )}

                </CardContent>

            )}
            {score ? (<Divider className={Styles.dividerStyle}/>) : null}
            {appName === 'webapp-cfo' && (
                <CardContent className={Styles.cardActionFooterStyle}>
                    {score ? (
                        <Box>
                            <Box sx={{mb: 3, alignItems: 'center', textAlign: 'right'}}>
                                <Typography variant='body2'>{score} % </Typography>
                            </Box>
                            <LinearProgress color='primary' variant='determinate' sx={{mb: 3, height: 10}}
                                            value={score}/>
                        </Box>
                    ) : null}
                </CardContent>
            )}
        </Card>
    )
}

export default QuizCard
