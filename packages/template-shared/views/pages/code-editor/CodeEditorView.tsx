import OutputDetails from './components/OutputDetails'
import OutputWindow from './components/OutputWindow'
import React, { useEffect, useState } from 'react'
import { languageOptions } from './constants/languageOptions'
import useKeyPress from './hooks/useKeyPress'

import toast from 'react-hot-toast'

import Editor from '@monaco-editor/react'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Card from '@mui/material/Card'
import { AppQuery } from 'template-shared/@core/utils/fetchWrapper'

interface codeProp {
  code?: string
  language?: any
  onChangeCode?: (val: string) => void
}

const CodeEditorView = (prop: codeProp) => {
  const [code, setCode] = useState('')

  const [customInput, setCustomInput] = useState('')
  const [outputDetails, setOutputDetails] = useState(null)
  const [processing, setProcessing] = useState(null)
  const [language, setLanguage] = useState(languageOptions[0])

  const enterPress = useKeyPress('Enter')
  const ctrlPress = useKeyPress('Control')

  const onSelectChange = sl => {
    console.log('selected Option...', sl)
    console.log(processing)
    setCustomInput('')
    setLanguage(sl)
  }

  useEffect(() => {
    if (enterPress && ctrlPress) {
      handleCompile()
    }
  }, [ctrlPress, enterPress])
  const onChange = (action, data) => {
    switch (action) {
      case 'code': {
        setCode(data)
        prop.onChangeCode(data)
        break
      }
      default: {
        console.warn('case not handled!', action, data)
      }
    }
  }
  const handleCompile = async () => {
    setProcessing(true)
    try {
      const response = await AppQuery('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': '09cbbef1c6msh74561d90b909fc9p121ecajsn6c4270f6ccf5'
        },
        body: JSON.stringify({
          language_id: language?.id,
          source_code: btoa(code),
          stdin: btoa(customInput)
        })
      })
      const result = await response.json()
      console.log('result', result)
      checkStatus(result.token)
    } catch (err) {
      const error = err.response ? err.response.data : err
      const status = err.response ? err.response.status : null
      console.log('status', status)
      if (status === 429) {
        console.log('too many requests', status)
        showErrorToast(
          `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`
        )
      }
      setProcessing(false)
      console.log('catch block...', error)
    }
  }

  const checkStatus = async token => {
    const options = {
      method: 'GET',

      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': '09cbbef1c6msh74561d90b909fc9p121ecajsn6c4270f6ccf5'
      }
    }
    try {
      console.log('token', token)
      const response = await AppQuery('https://judge0-ce.p.rapidapi.com/submissions' + '/' + token, options)

      const result = await response.json()
      console.log('results', result)
      const statusId = result.status?.id

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token)
        }, 2000)

        return
      } else {
        console.log('result', result)
        setProcessing(false)
        setOutputDetails(result)
        showSuccessToast(`Compiled Successfully!`)
        console.log('response.data', result)

        return
      }
    } catch (err) {
      console.log('err', err)
      setProcessing(false)
      showErrorToast(err)
    }
  }

  const showSuccessToast = msg => {
    toast.success(msg || `Compiled Successfully!`)
  }

  useEffect(() => {
    if (prop) {
      setCode(prop.code)
      onSelectChange(prop.language[0])
    }
  }, [prop.code])

  const showErrorToast = msg => {
    toast.error(msg || `Something went wrong! Please try again.`)
  }

  return (
    <>
      <div className='h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500'></div>
      <Card
        style={{
          marginBottom: '20px',
          marginTop: '1%',

          width: '99%'
        }}
      >
        <IconButton
          style={{ color: '#f2f2f2', background: 'green', marginLeft: '95%', cursor: 'pointer' }}
          size='small'
          sx={{ color: 'text.secondary' }}
          onClick={handleCompile}
          disabled={!code}
        >
          <Icon icon='tabler:play' />
        </IconButton>
      </Card>
      <div className='flex flex-row space-x-4 items-start px-4 py-4'>
        <div className='flex flex-col w-full h-full justify-start items-end' style={{ width: '100%' }}>
          <Card>
            <Editor
              height='65vh'
              width={`100%`}
              language={language?.value || 'javascript'}
              value={code}
              theme='active4d'
              onChange={e => {
                onChange('code', e)
              }}
            />
          </Card>
        </div>

        <div
          className='right-container flex flex-shrink-0 w-[30%] flex-col'
          style={{ width: '99%', marginTop: '3%', marginBottom: '3%' }}
        >
          <OutputWindow outputDetails={outputDetails} />
          <div className='flex flex-col items-end'></div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
    </>
  )
}

export default CodeEditorView
