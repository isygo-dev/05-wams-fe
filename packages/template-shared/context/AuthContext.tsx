import jwt from 'jsonwebtoken'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import authConfig from '../configs/auth'
import { AuthValuesType, ErrCallbackType, LoginParams, UserDataType } from './types'
import toast from 'react-hot-toast'
import localStorageKeys from '../configs/localeStorage'
import imsApiUrls from 'ims-shared/configs/ims_apis'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const router = useRouter()

  const getToken = async (params: any) => {
    //TODO change to query
    axios.post(imsApiUrls.apiUrl_IMS_Login_EndPoint, params).then(async response => {
      window.localStorage.setItem(localStorageKeys.accessToken, response.data.accessToken)
      window.localStorage.setItem(localStorageKeys.authorityToken, response.data.authorityToken)
      const returnUrl = router.query.returnUrl
      setUser({ ...response.data.userDataResponseDto })
      const systemInfoToStore = JSON.stringify({ ...response.data.systemInfo })
      window.localStorage.setItem(localStorageKeys.userData, JSON.stringify({ ...response.data.userDataResponseDto }))
      window.localStorage.setItem(localStorageKeys.systemInfo, systemInfoToStore)
      setLoading(false)
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
      router.replace(redirectURL as string)
    })
  }

  const initAuth = async (): Promise<void> => {
    let storedToken = localStorage.getItem(localStorageKeys.accessToken)
    let storedUser = localStorage.getItem(localStorageKeys.userData)
    const { accessToken: urlToken } = router.query
    let logFromGateway = false
    const paramToken: string | undefined = urlToken?.toString()?.replace('Bearer_', '')
    if (paramToken) {
      storedToken = paramToken
      storedUser = null
      localStorage.setItem(localStorageKeys.accessToken, paramToken)
      logFromGateway = true
    }
    const expirationTime = storedToken ? jwt?.decode(storedToken, { json: true }) : null
    if (storedToken && expirationTime?.exp != null && expirationTime?.exp * 1000 > new Date().getTime()) {
      if (storedUser) {
        if (JSON.parse(storedUser)) {
          setUser({ ...JSON.parse(storedUser) })
          console.log('In stored user', { ...JSON.parse(storedUser) })
        }
      } else if (logFromGateway) {
        const oldTokenDecoded = jwt.decode(paramToken, { complete: true })
        const decodeToken = oldTokenDecoded?.payload
        setLoading(true)

        const dataPrams = {
          domain: decodeToken['sender-domain'],
          application: process.env.NEXT_PUBLIC_APP_NAME,
          userName: decodeToken['sender-user'],
          password: paramToken,
          authType: 'TOKEN'
        }

        getToken(dataPrams)
      } else {
        setLoading(true)
        await axios
          .get(imsApiUrls.apiUrl_IMS_MyAccount_EndPoint, {
            headers: {
              Authorization: 'Bearer ' + storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data })
            window.localStorage.setItem(localStorageKeys.userData, JSON.stringify({ ...response.data }))
          })
          .catch(() => {
            localStorage.removeItem(localStorageKeys.userData)
            localStorage.removeItem(localStorageKeys.refreshToken)
            localStorage.removeItem(localStorageKeys.accessToken)

            setUser(null)
            setLoading(false)
            if (authConfig.refreshToken === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      }
    } else {
      localStorage.removeItem(localStorageKeys.userData)
      localStorage.removeItem(localStorageKeys.refreshToken)
      localStorage.removeItem(localStorageKeys.accessToken)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user == null && router.isReady) {
      initAuth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(imsApiUrls.apiUrl_IMS_Login_EndPoint, params)
      .then(async response => {
        window.localStorage.setItem(localStorageKeys.accessToken, response.data.accessToken)
        window.localStorage.setItem(localStorageKeys.authorityToken, response.data.authorityToken)
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.userDataResponseDto })
        const systemInfoToStore = JSON.stringify({ ...response.data.systemInfo })
        window.localStorage.setItem(localStorageKeys.userData, JSON.stringify({ ...response.data.userDataResponseDto }))
        window.localStorage.setItem(localStorageKeys.systemInfo, systemInfoToStore)
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
      })

      .catch(err => {
        console.log(err.response.data)
        toast.error(err.response.data)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    console.log(localStorage.getItem('rememberMe') == 'true')
    if (localStorage.getItem('rememberMe') == 'true') {
      const domain = localStorage.getItem('domain')
      const userName = localStorage.getItem('userName')
      window.localStorage.clear()
      localStorage.setItem('domain', domain)
      localStorage.setItem('userName', userName)
    } else {
      window.localStorage.clear()
    }
    sessionStorage.clear()
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
