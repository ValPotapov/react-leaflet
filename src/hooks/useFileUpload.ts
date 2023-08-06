import { useState, useRef } from 'react';

export type FileError = {
  type: 'invalidType' | 'fileSizeExceeded';
  message: string;
};

type UploadResult = {
  file: File | null;
  isLoading: boolean;
  errorMessage: FileError | null;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
};

export const useFileUpload = (allowedTypes: string[], maxSize: number): UploadResult => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<FileError | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file: File | null) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type.split('/')[1])) {
      setErrorMessage({ type: 'invalidType', message: 'Only CSV files are allowed' });
      setFile(null);
      return;
    }

    if (file.size > maxSize) {
      setErrorMessage({ type: 'fileSizeExceeded', message: 'File size should not exceed 5 MB' });
      setFile(null);
      return;
    }

    setIsLoading(true); 
    // Имитируем задержку в 2 секунды перед завершением загрузки

    setTimeout(() => {
      setFile(file);
      setErrorMessage(null);
      setIsLoading(false);
    }, 1500);
  };

  return {
    file,
    isLoading,
    errorMessage,
    handleDrop,
    handleDragOver,
    handleInputChange,
    fileInputRef,
  };
};


