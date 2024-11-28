import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import linkApiUrls from "link-shared/configs/link_apis"
import {TFunction} from 'i18next'
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'
import toast from 'react-hot-toast'
import {BlogTalkType} from "link-shared/@core/types/link/BlogTypes";

const BlogTalkApis = (t: TFunction) => {
    const permission = PermissionPage.BLOG_TALK

    const addBlogTalk = async (blogTalk: BlogTalkType) => {
        if (!checkPermission(PermissionApplication.LINK, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on add ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Blog_Talk_EndPoint}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(blogTalk)
        })

        if (!response.ok) {
            return
        } else {
            toast.success(t('Blog.talk_added_successfully'))
        }

        return await response.json()
    }

    const getBlogTalksByBlogId = async (id: number) => {
        if (!checkPermission(PermissionApplication.LINK, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Blog_TalkById_EndPoint}?page=${id}`, {
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

    const updateBlogTalk = async (param: BlogTalkType) => {
        if (!checkPermission(PermissionApplication.LINK, permission, PermissionAction.WRITE)) {
            console.warn('Permission denied on update ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Blog_Talk_EndPoint}?id=${param.id}`, {
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
            toast.success(t('Blog.talk_updated_successfully'))
        }

        return await response.json()
    }

    const deleteBlogTalkById = async (id: number) => {
        if (!checkPermission(PermissionApplication.LINK, permission, PermissionAction.DELETE)) {
            console.warn('Permission denied on delete ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Blog_Talk_EndPoint}?id=${id}`, {
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
            toast.success(t('Blog.talk_deleted_successfully'))
        }

        return await response.json()
    }

    return {
        addBlogTalk,
        getBlogTalksByBlogId,
        updateBlogTalk,
        deleteBlogTalkById
    }
}

export default BlogTalkApis
