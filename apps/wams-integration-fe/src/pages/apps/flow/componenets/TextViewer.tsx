import React from 'react'

type TextViewerProps = {
  data: string
}

const TextViewer: React.FC<TextViewerProps> = ({ data }) => {
  return <pre>{data}</pre>
}

export default TextViewer
