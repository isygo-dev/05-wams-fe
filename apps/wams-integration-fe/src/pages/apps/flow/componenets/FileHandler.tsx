import React from 'react';

type FileHandlerProps = {
  onFileLoad: (file: File, fileType: string) => void;
};

const FileHandler: React.FC<FileHandlerProps> = ({onFileLoad}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const fileType = selectedFile.type;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onFileLoad(selectedFile, fileType);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  return <input type="file" accept=".json,.xml,.txt" onChange={handleFileChange}/>;
};

export default FileHandler;
