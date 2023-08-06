import React, { ComponentType } from 'react';
import { FileError } from '../../hooks';
import { Box, BoxProps, Button, Paper, Stack, Typography } from '@mui/material';
import { Search, CloudUpload } from '@mui/icons-material/';

type RouteUploadFileProps = BoxProps & {
  file: File | null;
  isLoading: boolean;
  errorMessage: FileError | null;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
};

export const RouteUploadFile: ComponentType<RouteUploadFileProps> = ({
  file,
  isLoading,
  errorMessage,
  handleDrop,
  handleDragOver,
  handleInputChange,
  fileInputRef,
  ...props
}) => {
  const [onDragOver, setOnDragOver] = React.useState<boolean>();

  return (
    <Box
      component={Paper}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => {
        handleDrop?.(e);
      }}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        handleDragOver(e);
        setOnDragOver(true);
      }}
      onDragLeave={() => {
        setOnDragOver(false);
      }}
      onClick={() => {
        // Open file dialog when the container is clicked
        fileInputRef.current?.click();
      }}
      {...props}
      elevation={onDragOver === true ? 3 : 0}
      sx={{
        ...props.sx,
        p: 2,
        textAlign: 'center',
        width: `calc(100% - 32px)`,
        maxWidth: 600,
      }}
    >
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        accept=".csv"
        onChange={handleInputChange}
      />
      {isLoading && <div className="loader">Loading...</div>}
      {errorMessage && <p className="error-message">{errorMessage.message}</p>}
      <Stack
        sx={{
          alignItems: 'center',
          color: 'text.secondary',
        }}
      >
        <CloudUpload
          sx={{
            fontSize: 64,
            width: '1em',
            height: '1em',
          }}
        />
        <Typography variant="subtitle1">Перетащите файл сюда.</Typography>
        <Typography variant="caption">
          Формат файла CSV.
          <br />
          Максимальный размер файла 5 МБ.
        </Typography>
        <Button
          variant="contained"
          endIcon={<Search />}
          size="large"
          sx={{
            mt: 2,
          }}
        >
          Выберите файл
        </Button>
      </Stack>
      {/* {file ? (
        <Stack>
          <Typography variant="subtitle1">Загруженный файл:</Typography>
          <Typography variant="caption">{file.name}</Typography>
        </Stack>
      ) : (
        <Stack
          sx={{
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <CloudUpload
            sx={{
              fontSize: 64,
              width: '1em',
              height: '1em',
            }}
          />
          <Typography variant="subtitle1">Перетащите файл сюда.</Typography>
          <Typography variant="caption">
            Формат файла CSV.
            <br />
            Максимальный размер файла 5 МБ.
          </Typography>
          <Button
            variant="contained"
            endIcon={<Search />}
            size="large"
            sx={{
              mt: 2,
            }}
          >
            Выберите файл
          </Button>
        </Stack>
      )} */}
    </Box>
  );
};
