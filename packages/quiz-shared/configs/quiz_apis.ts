import 'dotenv/config' // Import and load dotenv

const api_version = '/api/v1'

let apiUrl_QUIZ: string | undefined

if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
  apiUrl_QUIZ = 'https://quiz.dev.wams.isygoit.eu'

  // apiUrl_QUIZ = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/quiz`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
  apiUrl_QUIZ = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/quiz`

  // apiUrl_QUIZ = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/quiz`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
  apiUrl_QUIZ = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/quiz`

  // apiUrl_QUIZ = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/quiz`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
  apiUrl_QUIZ = 'http://127.0.0.1:40412'

  // apiUrl_QUIZ = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/quiz`
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
  apiUrl_QUIZ = 'https://quiz.dev.wams.isygoit.eu'

  // apiUrl_QUIZ = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/quiz`
} else {
  apiUrl_QUIZ = 'https://quiz.dev.wams.isygoit.eu'

  // apiUrl_QUIZ = `${process.env.NEXT_PUBLIC_FE_GATEWAY_URL}/quiz`
}

const quizApiUrls = {
  apiUrl_QUIZ,
  apiUrl_QUIZ_Quiz_EndPoint: apiUrl_QUIZ + api_version + '/private/quiz',
  apiUrl_QUIZ_Quiz_Count_EndPoint: apiUrl_QUIZ + api_version + '/private/quiz/count',
  apiUrl_QUIZ_QuizCandidate_EndPoint: apiUrl_QUIZ + api_version + '/private/candidate/quiz',
  apiUrl_QUIZ_QuizCandidateAnswer_EndPoint: apiUrl_QUIZ + api_version + '/private/candidate/quiz/answer/submit',
  apiUrl_QUIZ_QuizCandidateReport_EndPoint: apiUrl_QUIZ + api_version + '/private/candidate/quiz/report',
  apiUrl_QUIZ_QuizCandidateCopy_EndPoint: apiUrl_QUIZ + api_version + '/private/candidate/quiz/copy',
  apiUrl_QUIZ_QuizCandidateStart_EndPoint: apiUrl_QUIZ + api_version + '/private/candidate/quiz/start',
  apiUrl_QUIZ_QuizCandidateAnswerStart_EndPoint: apiUrl_QUIZ + api_version + '/private/candidate/quiz/answer/start',
  apiUrl_QUIZ_QuizCandidateSubmit_EndPoint: apiUrl_QUIZ + api_version + '/private/candidate/quiz/submit',
  apiUrl_QUIZ_QuizCandidateComplete_EndPoint: apiUrl_QUIZ + api_version + '/private/candidate/quiz/complete',
  apiUrl_QUIZ_QuizCandidateByTags_EndPoint: apiUrl_QUIZ + api_version + '/private/candidate/quiz/tags',
  apiUrl_QUIZ_Question_Image_EndPoint: apiUrl_QUIZ + api_version + '/private/quiz/question/image',
  apiUrl_QUIZ_Question_ImageUpload_EndPoint: apiUrl_QUIZ + api_version + '/private/quiz/question/image/upload',
  apiUrl_QUIZ_Question_ImageDownload_EndPoint: apiUrl_QUIZ + api_version + '/private/quiz/question/image/download',
  apiUrl_QUIZ_Quiz_Category_EndPoint: apiUrl_QUIZ + api_version + '/private/quiz/category',
  apiUrl_QUIZ_Quiz_DetailsByCode_EndPoint: apiUrl_QUIZ + api_version + '/private/quiz/code',
  apiUrl_QUIZ_QuizCandidateAnswers_EndPoint: apiUrl_QUIZ + api_version + '/private/candidate/quiz/answer/list/submit',
  apiUrl_QUIZ_QuizCandidateAnswer_CompleteAndClean_EndPoint:
    apiUrl_QUIZ + api_version + '/private/candidate/quiz/complete/clean'
}

export default quizApiUrls
