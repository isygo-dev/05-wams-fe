import {AppQuery} from 'template-shared/@core/utils/fetchWrapper'
import linkApiUrls from "link-shared/configs/link_apis"
import {TFunction} from "i18next";
import {checkPermission} from 'template-shared/@core/api/helper/permission'
import {
    PermissionAction,
    PermissionApplication,
    PermissionPage
} from 'template-shared/@core/types/helper/apiPermissionTypes'


const BlogApis = (t: TFunction) => {
    const permission = PermissionPage.BLOG

    const getBlogById = async (id: number) => {
        if (!checkPermission(PermissionApplication.LINK, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Blog_EndPoint}/${id}`, {
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

    const getBlogs = async (page: number, size: number) => {
        if (!checkPermission(PermissionApplication.LINK, permission, PermissionAction.READ)) {
            console.warn('Permission denied on read ' + t(permission))

            return
        }

        const response = await AppQuery(`${linkApiUrls.apiUrl_LINK_Blog_Full_EndPoint}/${page}/${size}`, {
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
        getBlogById,
        getBlogs
    }
}

export default BlogApis
