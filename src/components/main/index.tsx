import { ComponentType, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { RouteUploadFile } from '../../features';
import { useFileUpload, useRoute } from '../../hooks';
import { RightMenu } from '../../features/right-menu';

import { useAppSelector, useAppDispatch, dataActions } from '../../store';

import { RouteMap } from '../../features/route-map';

export const Main: ComponentType = () => {
  const dispatch = useAppDispatch();
  const routes = useAppSelector((state) => state.data.routes);

  const {
    file,
    isLoading: isLoadingFile,
    errorMessage,
    handleDrop,
    handleDragOver,
    handleInputChange,
    fileInputRef,
  } = useFileUpload(['csv'], 5 * 1024 * 1024);

  const { dataRoute, dataExtraPoints } = useRoute(file);

  const routesNotEmpty = Object.keys(routes).length > 0;

  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (Object.keys(dataRoute).length > 0) {
      dispatch(dataActions.setRoutes(dataRoute));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRoute]);

  useEffect(() => {
    if (dataExtraPoints.length) {
      dispatch(dataActions.setExtraPoints(dataExtraPoints));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataExtraPoints]);

  return (
    <Box display="flex" position="relative" flexDirection="row" height="100vh" width="100%">
      {!routesNotEmpty ? (
        <RouteUploadFile
          file={file}
          isLoading={isLoadingFile}
          errorMessage={errorMessage}
          fileInputRef={fileInputRef}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleInputChange={handleInputChange}
          sx={{
            alignSelf: 'center',
            margin: 'auto',
          }}
        />
      ) : null}
      {routesNotEmpty ? (
        <>
          <Box width="100%">
            <RouteMap mapRef={mapRef} />
          </Box>
          <RightMenu mapRef={mapRef}  />
        </>
      ) : null}
    </Box>
  );
};
