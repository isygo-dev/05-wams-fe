import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'
import quizApiUrls from "quiz-shared/configs/quiz_apis";
import {QuizDetailType, QuizType} from 'quiz-shared/@core/types/quiz/quizTypes'

import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {TFunction} from 'i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'

const QuizApis = (t: TFunction) => {
    const permission = PermissionPage.QUIZ

    const getQuizs = async () => {
        if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_Quiz_EndPoint}`, {
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

        return await response.json()
    }

    const getQuizsCount = async () => {
        if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_Quiz_Count_EndPoint}`, {
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

        return await response.json()
    }

    const getQuizsByPage = async (page: number, size: number) => {
        if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_Quiz_EndPoint}/${page}/${size}`, {
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

        return await response.json()
    }

    const getQuizById = async (id: number) => {
        if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_Quiz_EndPoint}/${id}`, {
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

        return await response.json()
    }

    const deleteQuizById = async (id: number) => {
        if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_Quiz_EndPoint}?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Quiz_deleted_successfully'))
        }

        return id
    }

    const updateQuiz = async (quiz: QuizDetailType) => {
        if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_Quiz_EndPoint}?id=${quiz.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(quiz)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Quiz_updated_successfully'))
        }

        return await response.json()
    }

    const addQuiz = async (quiz: QuizType) => {
        if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_Quiz_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(quiz)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Quiz_added_successfully'))
        }

        return await response.json()
    }

    const uploadQuizQuestionImage = async (data: any) => {
        if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on write ' + t(permission))

            return
        }

        const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_Question_ImageUpload_EndPoint}/${data.id}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: data.file
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Quiz.question_image_uploaded_successfully'))
        }

        return await response.json()
    }

    const getQuizByCategory = async category => {
        if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_Quiz_Category_EndPoint}?category=${category}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        if (!response.ok) {
            return
        }

        return await response.json()
    }

    const getQuizByCode = async (code: string) => {
        if (!checkPermission(PermissionApplication.QUIZ, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${quizApiUrls.apiUrl_QUIZ_Quiz_DetailsByCode_EndPoint}/${code}`, {
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

        return await response.json()
    }

    return {
        getQuizs,
        getQuizsCount,
        getQuizsByPage,
        getQuizById,
        deleteQuizById,
        updateQuiz,
        addQuiz,
        uploadQuizQuestionImage,
        getQuizByCategory,
        getQuizByCode
    }
}

export default QuizApis
