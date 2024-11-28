import jwt from 'jsonwebtoken'
import localStorageKeys from '../../../../configs/localeStorage'
import {PermissionAction} from "template-shared/@core//types/helper/apiPermissionTypes";

interface AuthorityToken {
    aud: string
    'sender-domain': string
    exp: number
    'granted-authority': string[]
    iat: number
    iss: string
    'log-app': string
    sub: string
    'user-name': string
}

interface TokenType {
    sub: string
    iss: string
    iat: number
    exp: number
    aud: string
    'sender-domain': string
    'is-admin': boolean
    'log-app': string
    'sender-user': string
}

export const checkPermission = (application: string, page: string, action: string) => {
    const token = localStorage.getItem(localStorageKeys.authorityToken)
    const oldTokenDecoded = jwt.decode(token, {complete: true})
    const text = application + action + page
    const listCheck: AuthorityToken = oldTokenDecoded?.payload as AuthorityToken
    if (listCheck && listCheck['log-app'] !== 'SmartCode-UI') {
        const index = listCheck['granted-authority']?.findIndex(d => d === text)
        if (index > -1) {
            return true
        } else {
            return true
        }
    } else return true
}

export const checkPermissionSideBar = (item: any) => {

    /*  if (item.sectionTitle) {

          return true
      } else if (item.applicationConnect !== 'SmartCode-UI'|| item.applicationConnect !== 'Integration' || !item.applicationConnect) {
          if (item.permissionSection === 'NavSectionTitle' && item.children.length > 0) {
              const newListChild: any[] = []
              item.children.forEach(child => {
                  if (checkPermission(child.permissionApplication, child.permissionPage, PermissionAction.READ)) {
                      newListChild.push(child)
                  }
              })

              return newListChild.length > 0
          } else {
              return checkPermission(item.permissionApplication, item.permissionPage, PermissionAction.READ)
          }
      } else return true*/

    if (item.sectionTitle) {
        return true
    } else if (item.applicationConnect === 'SmartCode-UI' || item.applicationConnect === 'Integration') {
        return true
    } else if (item.permissionSection ===
        'NavSectionTitle'
        && item.children.length > 0) {
        const newListChild: any[] = []
        item.children.forEach(child => {
            if (checkPermission(child.permissionApplication, child.permissionPage, PermissionAction.READ
            )) {
                newListChild.push(child)
            }
        })

        return newListChild.length > 0
    } else {
        return checkPermission(item.permissionApplication, item.permissionPage, PermissionAction.READ
        )
    }
}

export const getUserDomainFromToken = () => {
    const token = localStorage.getItem(localStorageKeys.accessToken)
    console.log('tdtdtdd', token)
    const oldTokenDecoded = jwt.decode(token, {complete: true})
    const listCheck: TokenType = oldTokenDecoded?.payload as TokenType
    console.log('suydbvsdb', listCheck)

    return listCheck['sender-domain']
}
