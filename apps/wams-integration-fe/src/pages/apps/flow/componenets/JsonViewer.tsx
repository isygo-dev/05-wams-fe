import React from 'react';

type JsonViewerProps = {
  data: string;
};

const JsonViewer: React.FC<JsonViewerProps> = ({data}) => {
  try {
    const jsonData = JSON.parse(data);

    return <pre>{JSON.stringify(jsonData, null, 2)}</pre>;
  } catch (error) {
    return <div>Invalid JSON</div>;
  }
};

export default JsonViewer;
