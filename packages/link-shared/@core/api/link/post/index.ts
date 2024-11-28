import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import linkApiUrls from "link-shared/configs/link_apis"
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from "template-shared/@core/types/helper/apiPermissionTypes";
import {TFunction} from 'i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {CommentType} from 'link-shared/@core/types/link/PostTypes'
import toast from 'react-hot-toast'

const PostApis = (t: TFunction) => {
    const permission = PermissionPage.POST

    const addPostDocument = async (post: FormData) => {
        if (!checkPermission(PermissionApplication.LINK, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_FileCreate_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: post
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Post.added_successfully'))
        }

        return await response.json()
    }

    const addPostImage = async (post: FormData) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_Image_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: post
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Post.added_successfully'))
        }

        return await response.json()
    }

    const getPosts = async (page: number, size: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_EndPoint}/${page}/${size}`, {
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

    const getPostBlogByPage = async (page: number, size: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_Blog_EndPoint}/${page}/${size}`, {
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

    const updatePostImage = async (param: FormData) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_Image_EndPoint}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: param
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Post.updated_successfully'))
        }

        return await response.json()
    }

    const updatePostDocument = async (id: number, param: FormData) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_FileUpdate_EndPoint}?id=${id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: param
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Post.updated_successfully'))
        }

        return await response.json()
    }

    const deletePostById = async (id: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_EndPoint}?id=${id}`, {
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
            toast.success(t('Post.added_successfully'))
        }

        return id
    }

    const addPostComment = async (todo: CommentType) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_Comment_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(todo)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Post.comment_added_successfully'))
        }

        return await response.json()
    }

    const updatePostComment = async (param: CommentType) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_Comment_EndPoint}?id=${param.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(param)
        })
        if (!response.ok) {
            return
        } else {
            toast.success(t('Post.comment_updated_successfully'))
        }

        return await response.json()
    }

    const deletePostCommentById = async (id: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_Comment_EndPoint}?id=${id}`, {
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
            toast.success(t('Post.comment_deleted_successfully'))
        }

        return id
    }

    const addPostLike = async (idPost: number, userCode: string, isLike: boolean) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${linkApiUrls.apiUrl_LINK_Post_UserLiked_EndPoint}?id=${idPost}&accountCode=${userCode}&isLike=${isLike}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (!response.ok) {
            return
        } else {
            toast.success(t('Post.like_added_successfully'))
        }

        return await response.json()
    }

    const addPostDislike = async (idPost: number, userCode: string, isLike: boolean) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${linkApiUrls.apiUrl_LINK_Post_UserDisliked_EndPoint}?id=${idPost}&accountCode=${userCode}&isLike=${isLike}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (!response.ok) {
            return
        } else {
            toast.success(t('Post.dislike_added_successfully'))
        }

        return await response.json()
    }

    const addPostCommentLike = async (idComment: number, userCode: string) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${linkApiUrls.apiUrl_LINK_Post_CommentUserLiked_EndPoint}?id=${idComment}&accountCode=${userCode}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (!response.ok) {
            return
        } else {
            toast.success(t('Post.comment like_added_successfully'))
        }

        return await response.json()
    }

    const addPostCommentDislike = async (idComment: number, userCode: string) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(
            `${linkApiUrls.apiUrl_LINK_Post_CommentUserDisliked_EndPoint}?id=${idComment}&accountCode=${userCode}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (!response.ok) {
            return
        } else {
            toast.success(t('Post.comment dislike_added_successfully'))
        }

        return await response.json()
    }

    const getPostById = async (id: number) => {
        if (!checkPermission(PermissionApplication.IMS, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Post_EndPoint}/${id}`, {
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
        addPostDocument,
        addPostImage,
        getPosts,
        getPostBlogByPage,
        updatePostImage,
        updatePostDocument,
        deletePostById,
        addPostComment,
        updatePostComment,
        deletePostCommentById,
        addPostLike,
        addPostDislike,
        addPostCommentLike,
        addPostCommentDislike,
        getPostById
    }
}

export default PostApis
