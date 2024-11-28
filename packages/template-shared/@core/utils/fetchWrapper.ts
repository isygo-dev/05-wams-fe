import authConfig from '../../configs/auth'

export async function AppQuery(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    showSpinner()

    const defaultHeader: RequestInit = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

    init.headers = new Headers((init == null || init.headers == null) ? defaultHeader.headers : init.headers)

    //set header token before sending request
    const token = localStorage?.getItem(authConfig.accessToken)
    if (token) {
        init.headers.set('Authorization', 'Bearer ' + token)
    }

    const response = await fetch(input, init)
    if (!response.ok) {
        hideSpinner()
        throw new HttpError(response.status, await response.clone().text())
    }
    hideSpinner()

    return response
}

export class HttpError extends Error {
    public constructor(
        public code: number,
        message?: string
    ) {
        super(message)
    }
}

const showSpinner = () => {
    document.body.classList.add('loading-indicator')
}

const hideSpinner = () => {
    document.body.classList.remove('loading-indicator')
}
