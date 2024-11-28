import React, {useEffect, useState} from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'
import {AnswerType, QuestionDetailsType} from "quiz-shared/@core/types/quiz/quizCandidateType";

interface AnswerItem {
  allQuestions: QuestionDetailsType[]
  onAnswerChange: (index: number, answerData: AnswerType) => void
}

const AnswerList = (props: AnswerItem) => {
  const {allQuestions, onAnswerChange} = props
  const [answers, setAnswers] = useState<AnswerType[]>([])

  useEffect(() => {
    const initialAnswers = allQuestions.map(question => ({
      question: question.id,
      score: question.score,
      option: 0,
      answerText: question.textAnswer
    }))
    setAnswers(initialAnswers)
  }, [allQuestions])

  const handleRatingChange = (index: number, value: number) => {
    const newAnswers = [...answers]
    newAnswers[index] = {...newAnswers[index], score: value}
    setAnswers(newAnswers)
    onAnswerChange(index, newAnswers[index])
  }

  const handleNoteChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = {...newAnswers[index], answerText: value}
    setAnswers(newAnswers)
    onAnswerChange(index, newAnswers[index])
  }

  return (
    <>
      {allQuestions.map((question, index) => (
        <Grid container key={index} spacing={3} sx={{mt: 3}}>
          <Grid item md={4}>
            <Typography>
              Q{index + 1}: {question.question}
            </Typography>
          </Grid>
          <Grid item md={2}>
            <Rating
              name={`rating-${index}`}
              value={answers[index]?.score || null}
              onChange={(event, value) => handleRatingChange(index, value)}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              size='small'
              fullWidth
              label='Note'
              multiline
              rows={3}
              value={answers[index]?.answerText || ''}
              onChange={event => handleNoteChange(index, event.target.value)}
            />
          </Grid>
        </Grid>
      ))}
    </>
  )
}

export default AnswerList
