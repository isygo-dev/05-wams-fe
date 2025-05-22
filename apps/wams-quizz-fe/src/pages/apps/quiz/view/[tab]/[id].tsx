import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import QuizView from '../../../../../views/apps/quiz/view/QuizView'
import QuizApis from 'quiz-shared/@core/api/quiz/quiz'
import { useTranslation } from 'react-i18next'

const CustomerDetailView = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const {
    data: quizData,
    isError,
    isLoading
  } = useQuery(['quizData', id], () => QuizApis(t).getQuizById(Number(id)), {})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !quizData) {
    return <div>Error loading customer data</div>
  }

  return <QuizView quizData={quizData} />
}

export default CustomerDetailView
