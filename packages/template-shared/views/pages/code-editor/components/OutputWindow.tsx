import React from 'react'
import Card from '@mui/material/Card'

const OutputWindow = ({ outputDetails }) => {
  const getOutput = () => {
    const statusId = outputDetails?.status?.id

    if (statusId === 6) {
      // compilation error
      return <pre className='px-2 py-1 font-normal text-xs text-red-500'>{outputDetails?.compile_output}</pre>
    } else if (statusId === 3) {
      return (
        <pre className='px-2 py-1 font-normal text-xs text-green-500'>
          {outputDetails.stdout !== null ? outputDetails.stdout : null}
        </pre>
      )
    } else if (statusId === 5) {
      return <pre className='px-2 py-1 font-normal text-xs text-red-500'>{`Time Limit Exceeded`}</pre>
    } else {
      return <pre className='px-2 py-1 font-normal text-xs text-red-500'>{outputDetails?.stderr}</pre>
    }
  }

  return (
    <>
      <Card>
        <div
          style={{
            width: '138%',
            height: '11rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            color: 'rgb(40 40 40)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            overflowY: 'auto',

            marginBottom: '12px'
          }}
        >
          {outputDetails ? <>{getOutput()}</> : null}
        </div>
      </Card>
    </>
  )
}

export default OutputWindow
