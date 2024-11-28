import {useAuth} from '../../hooks/useAuth'
import {HttpError} from '../utils/fetchWrapper'

import {MutationCache, QueryCache, QueryClient, QueryClientProvider} from 'react-query'
import {ReactNode} from 'react'

import toast from 'react-hot-toast'

const CustomQueryClientProvider = ({children}: { children: ReactNode }) => {
    const auth = useAuth()
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                retry: 0,

                onError: (error: unknown) => {
                    if (error instanceof HttpError) errorHandling(error)
                }
            }
        },
        queryCache: new QueryCache({
            onError: (error: unknown) => {
                if (error instanceof HttpError) errorHandling(error)
            }
        }),
        mutationCache: new MutationCache({
            onError: (error: unknown) => {
                if (error instanceof HttpError) errorHandling(error)
            }
        })
    })
    const errorMessages: Set<string> = new Set()

    function errorHandling(error: Error | HttpError) {
        if (error instanceof HttpError) {
            if (error.code == 401) {
                auth.logout()
            }
            if (error.code === 500 || error.code === 400) {
                const message = error.message ? error.message : null
                if (message && !errorMessages.has(message)) {
                    toast.error(message)
                    errorMessages.add(message)
                }
            }
        }
    }

    return <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
}

export default CustomQueryClientProvider
