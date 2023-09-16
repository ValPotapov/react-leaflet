import {
  FC,
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
  MutableRefObject,
  memo,
} from 'react';
import { Button, Grid, Box, Typography } from '@mui/material';

import { RouteList } from '../route-list';

import { RouteDto } from '../../models';
import { ShipmentList } from '../shipment-list';
import { Filters } from '../filters';

import { useAppSelector, useAppDispatch, routesActions, dataActions } from '../../store';

import { useResizable } from 'react-resizable-layout';

import { SampleSplitter } from '../../components';

import TuneIcon from '@mui/icons-material/Tune';

// import { reverseObjectKeys } from '../../common/utils/reverseObject.utils';
import { sortByKey } from '../../common/utils/sortByKey.utils';

type PropsRightMenu = {
  mapRef: MutableRefObject<any>;
};

export const RightMenu: FC<PropsRightMenu> = memo(({ mapRef }) => {
  const dispatch = useAppDispatch();
  const routes = useAppSelector((state) => state.data.routes);
  const extraPoints = useAppSelector((state) => state.data.extraPoints);

  const { search, planId, extraPointDate, routeDate, sortExtraPoint, sortRoute } = useAppSelector(
    (state) => state.filters
  );

  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const { isDragging, position, splitterProps } = useResizable({
    axis: 'x',
    initial: 360,
    min: 200,
    max: 1000,
    reverse: true,
  });

  const {
    isDragging: isDraggingY,
    position: positionY,
    splitterProps: splitterPropsY,
  } = useResizable({
    axis: 'y',
    initial: window.innerHeight / 2,
    min: 100,
    max: 1000,
  });

  const filteredExtraPoints = useMemo(() => {
    const currentShipment = extraPoints.filter((route) => !route.truckID);

    const date = extraPointDate ? extraPointDate : '';

    const result = currentShipment.filter((value) => {
      if (
        (value.payload?.toLowerCase().includes(search.toLowerCase()) ||
          value.includesJIT?.toString().toLowerCase().includes(search.toLowerCase()) ||
          value.city?.toLowerCase().includes(search.toLowerCase())) &&
        value.planID?.toLowerCase().includes(planId.toLowerCase()) &&
        value.date?.includes(date)
      ) {
        return true;
      } else return false;
    });

    if (sortExtraPoint) {
      return result.sort(sortByKey<RouteDto>(sortExtraPoint));
    }

    return result;
  }, [search, extraPoints, planId, extraPointDate, sortExtraPoint]);

  const filteredRoutes = useMemo(() => {
    const routesKeys = Object.keys(routes);
    const routesArray = routesKeys.map((key) => routes[key]).flat();

    const date = routeDate ? routeDate : '';

    let result = routesArray.filter((value) => {
      if (
        (value.routeID.toLowerCase().includes(search.toLowerCase()) ||
          value?.payload?.toLowerCase().includes(search.toLowerCase()) ||
          value?.includesJIT?.toString().toLowerCase().includes(search.toLowerCase()) ||
          value.city.toLowerCase().includes(search.toLowerCase())) &&
        value?.planID.includes(planId) &&
        value.date.includes(date)
      ) {
        return true;
      } else return false;
    });

    if (sortRoute) {
      result = result.sort(sortByKey<RouteDto>(sortRoute));
    }

    const formatResult = result.reduce((acc, obj) => {
      let { routeID } = obj;
      routeID = `k${routeID}`;

      if (!acc[routeID]) {
        acc[routeID] = [];
      }
      acc[routeID].push(obj);
      return acc;
    }, {} as { [routeID: string]: RouteDto[] });

    return formatResult;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes, search, planId, routeDate, sortRoute]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const wrapperWidth = wrapperRef.current?.clientWidth;

  const handleSelectRoute = useCallback(
    (route: string) => {
      dispatch(routesActions.setSelectedRoute(filteredRoutes[route]));

      dispatch(routesActions.setLoading(true));

      dispatch(routesActions.setSelectedExtraPoint(null));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredRoutes]
  );

  const handleSelectExtraPoint = useCallback(
    (shipment: RouteDto) => {
      dispatch(routesActions.setSelectedExtraPoint(shipment));

      if (mapRef.current) {
        mapRef.current?.setView([shipment.latitude, shipment.longitude], 18);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapRef.current]
  );

  const onSelectItemRoute = useCallback(
    (route: RouteDto) => {
      dispatch(routesActions.setSelectedRouteItem(route));

      if (mapRef.current) {
        mapRef.current?.setView([route.latitude, route.longitude], 18);
        mapRef.current?.setView([route.latitude, route.longitude], 18);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapRef.current]
  );

  const handleReset = useCallback(() => {
    dispatch(routesActions.reset());
    dispatch(dataActions.reset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filteredRoutes) {
      const firstRoute = Object.keys(filteredRoutes)[0];

      dispatch(routesActions.setSelectedRoute(filteredRoutes[firstRoute]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box ref={wrapperRef} display="flex" position="absolute" right="0" zIndex={9999}>
      <SampleSplitter isDragging={isDragging} {...splitterProps} />
      <Box width={position} overflow="hidden" height="100vh" bgcolor="white">
        {isOpenFilter && (
          <Filters right={wrapperWidth} handleClose={() => setIsOpenFilter(false)} />
        )}
        <Box height={positionY}>
          <Grid container spacing={1} p={2}>
            <Grid item>
              <Button variant="contained" size="small" onClick={handleReset}>
                Сбросить
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsOpenFilter((prev) => !prev)}
              >
                <TuneIcon />
                {search && <Typography>{search}; </Typography>}
                {planId && <Typography>Plan ID: {planId}</Typography>}
                {routeDate && <Typography>; {routeDate}</Typography>}
                {extraPointDate && <Typography>; {extraPointDate}</Typography>}
              </Button>
            </Grid>
          </Grid>
          <Box height="calc(100% - 71px)">
            <RouteList
              data={filteredRoutes}
              onSelectItem={onSelectItemRoute}
              onSelect={handleSelectRoute}
            />
          </Box>
        </Box>
        <SampleSplitter isDragging={isDraggingY} dir="vertical" {...splitterPropsY} />
        <Box height={`calc(100% - ${positionY}px)`}>
          <Box height="100%">
            <ShipmentList data={filteredExtraPoints} onSelect={handleSelectExtraPoint} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
