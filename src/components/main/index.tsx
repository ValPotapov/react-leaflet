import { Box, Button } from '@mui/material';
import { ComponentType, useEffect, useState } from 'react';
import { RouteList, RouteUploadFile } from '../../features';
import { RouteData, useFileUpload, useRoute } from '../../hooks';
import { RouteMap } from '../../features/route-map';
import { RouteDto } from '../../models';

interface MainProps {}

export const Main: ComponentType<MainProps> = () => {
  const [routes, setRoutes] = useState<RouteData>({});
  const [extraPoints, setExtraPoints] = useState<RouteDto[]>([]);
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const cachedRoute = localStorage.getItem('routes');
  const cachedExtraPoints = localStorage.getItem('extraPoints');

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

  const routesKeys = Object.keys(routes);
  const routesNotEmpty = routesKeys.length > 0;

  const handleSelect = (routeId: string) => {
    setCurrentRoute(routeId);
  };

  const handleReset = () => {
    setRoutes({});
    setExtraPoints([]);
    setCurrentRoute('');
    localStorage.removeItem('routes');
    localStorage.removeItem('extraPoints');
  };

  useEffect(() => {
    if (cachedRoute && cachedRoute.length > 2) {
      setRoutes(JSON.parse(cachedRoute));
    }
    if (dataRoute && Object.keys(dataRoute).length > 0) {
      setRoutes(dataRoute);
      localStorage.setItem('routes', JSON.stringify(dataRoute));
    }

    if (cachedExtraPoints && cachedExtraPoints.length > 0) {
      setExtraPoints(JSON.parse(cachedExtraPoints));
    }

    if (dataExtraPoints && dataExtraPoints.length > 0) {
      setExtraPoints(dataExtraPoints);
      localStorage.setItem('extraPoints', JSON.stringify(dataExtraPoints));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedRoute, dataRoute, file]);

  useEffect(() => {
    if (!currentRoute && routesNotEmpty) {
      setCurrentRoute(routesKeys['0']);
    }
  }, [currentRoute, routesKeys, routesNotEmpty]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100%',
      }}
    >
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
          <RouteMap
            route={routes[currentRoute]}
            extraPoints={extraPoints}
            sx={{
              order: 1,
              flex: '0 0 calc(100% - 360px)',
              width: 'calc(100% - 360px)',
            }}
          />
          <Box
            sx={{
              order: 2,
              flex: '0 0 360px',
              width: 360,
              height: '100%',
              bgcolor: 'background.paper',
            }}
          >
            <Box
              sx={{
                p: 2,
                flex: '0 0 68px',
                height: '68px',
              }}
            >
              <Button variant="contained" onClick={handleReset} fullWidth>
                Сбросить
              </Button>
            </Box>
            <RouteList
              data={routes}
              selectedId={currentRoute}
              onSelect={(routeId) => handleSelect(routeId)}
              sx={{
                flex: '0 0 calc(100% - 68px)',
                height: 'calc(100% - 68px)',
                width: '100%',
              }}
            />
          </Box>
        </>
      ) : null}
    </Box>
  );
};
