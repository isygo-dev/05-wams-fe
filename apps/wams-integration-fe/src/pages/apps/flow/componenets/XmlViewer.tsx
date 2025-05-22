import React from 'react'
import { parseStringPromise } from 'xml2js'

type XmlViewerProps = {
  data: string
}

const XmlViewer: React.FC<XmlViewerProps> = ({ data }) => {
  const [jsonData, setJsonData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    parseStringPromise(data)
      .then(result => {
        setJsonData(result)
        setLoading(false)
      })
      .catch(() => {
        setJsonData(null)
        setLoading(false)
      })
  }, [data])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!jsonData) {
    return <div>Invalid XML</div>
  }

  return <pre>{JSON.stringify(jsonData, null, 2)}</pre>
}

export default XmlViewer
