import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'
import quizApiUrls from 'quiz-shared/configs/quiz_apis'
import { AnswerType, QuizAnswerType } from 'quiz-shared/@core/types/quiz/quizCandidateType'
import { boolean } from 'yup'
import {
  PermissionAction,
  PermissionApplication,
  PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import { TFunction } from 'i18next'
import { checkPermission } from 'template-shared/@core/api/helper/permission'

const QuizCandidateApis = (t: TFunction) => {
  const permission = PermissionPage.CANDIDATE_QUIZ

  const quizCandidateStart = async (quizCode, accountCode) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${quizApiUrls.apiUrl_QUIZ_QuizCandidateStart_EndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(boolean)
      }
    )

    if (!response.ok) {
      return
    } else {
      toast.success(t('Quiz.candidate_started_successfully'))
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const updateQuizCandidate = async (quizCode, accountCode) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${quizApiUrls.apiUrl_QUIZ_QuizCandidateSubmit_EndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(boolean)
      }
    )

    if (!response.ok) {
      return
    } else {
      toast.success(t('Quiz.candidate_updated_successfully'))
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const addQuizCandidateAnswer = async (quizCode, accountCode, candidateQuizAnswer: QuizAnswerType) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on add ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${quizApiUrls.apiUrl_QUIZ_QuizCandidateAnswer_EndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(candidateQuizAnswer)
      }
    )

    if (!response.ok) {
      return
    } else {
      toast.success(t('Quiz.candidate answer_added_successfully'))
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const getQuizReport = async (quizCode, accountCode) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${quizApiUrls.apiUrl_QUIZ_QuizCandidateReport_EndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    if (!response.ok) {
      return
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const getQuizCandidate = async (quizCode, accountCode) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${quizApiUrls.apiUrl_QUIZ_QuizCandidateCopy_EndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    if (!response.ok) {
      return
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const startQuizCandidateAnswer = async (quizCode, accountCode, questionId) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on update ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${quizApiUrls.apiUrl_QUIZ_QuizCandidateAnswerStart_EndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(questionId)
      }
    )

    if (!response.ok) {
      return
    } else {
      toast.success(t('Quiz.candidate_answer_started_successfully'))
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const getQuizCandidates = async () => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_QuizCandidate_EndPoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (!response.ok) {
      return
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const deleteQuizCandidateById = async (id: number) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_QuizCandidate_EndPoint}?id=${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (!response.ok) {
      return
    } else {
      toast.success(t('Quiz.candidate_deleted_successfully'))
    }

    return id
  }

  const getQuizCandidateComplete = async (quizCode, accountCode) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${quizApiUrls.apiUrl_QUIZ_QuizCandidateComplete_EndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    if (!response.ok) {
      return
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const getQuizCandidatesByTags = async (accountCode, tags) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${quizApiUrls.apiUrl_QUIZ_QuizCandidateByTags_EndPoint}?accountCode=${accountCode}&tags=${tags}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    if (!response.ok) {
      return
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const addQuizCandidateAnswers = async (quizCode, accountCode, answerList: AnswerType[]) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.WRITE)) {
      console.warn('Permission denied on add ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${quizApiUrls.apiUrl_QUIZ_QuizCandidateAnswers_EndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(answerList)
      }
    )

    if (!response.ok) {
      return
    } else {
      toast.success(t('Quiz.candidate answers_added_successfully'))
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  const getQuizCandidateAnswersCompleteAndClean = async (quizCode, accountCode) => {
    if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
      console.warn('Permission denied on read ' + t(permission))

      return
    }

    const response = await AppQuery(
      `${quizApiUrls.apiUrl_QUIZ_QuizCandidateAnswer_CompleteAndClean_EndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    if (!response.ok) {
      return
    }

    // Handle 204 No Content or empty body
    if (response.status === 204) {
      return [] // or return null, depending on your business logic
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      console.warn('[API] Expected JSON but received:', contentType)

      return null
    }

    const result = await response.json()

    return result
  }

  return {
    getQuizReport,
    addQuizCandidateAnswer,
    updateQuizCandidate,
    quizCandidateStart,
    getQuizCandidate,
    startQuizCandidateAnswer,
    getQuizCandidates,
    deleteQuizCandidateById,
    getQuizCandidateComplete,
    getQuizCandidatesByTags,
    addQuizCandidateAnswers,
    getQuizCandidateAnswersCompleteAndClean
  }
}

export default QuizCandidateApis
