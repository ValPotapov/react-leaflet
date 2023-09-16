import { ComponentType, useState, useEffect, useMemo, useCallback } from 'react';

import { Box, Autocomplete, TextField, Grid, Button } from '@mui/material';

import { useDebounce } from '../../hooks';

import dayjs from 'dayjs';

// import filterDB from '../../common/data/filterDB.json';

import options from '../../common/data/optionsSort.json';

import { useAppDispatch, useAppSelector, filterActions } from '../../store';
import { RouteDto } from '../../models';

type Option = {
  value: string;
  label: string;
};

type SortOption = {
  value: keyof RouteDto;
  label: keyof RouteDto;
};

type FiltersProps = {
  right?: number;
  handleClose?: () => void;
};

const Filters: ComponentType<FiltersProps> = ({ handleClose = () => {} }) => {
  const dispatch = useAppDispatch();

  const { planId, search, routeDate, extraPointDate, sortExtraPoint, sortRoute } = useAppSelector(
    (state) => state.filters
  );

  const routes = useAppSelector((state) => state.data.routes);
  const extraPoints = useAppSelector((state) => state.data.extraPoints);

  const [stateSearch, setStateSearch] = useState<string>(search);

  const [pressed, setPressed] = useState(false);
  const [positionBox, setPositionBox] = useState({ x: -380, y: 16 });

  const debouncedSearch = useDebounce<string>(stateSearch, 700);

  const optionsPlanID = useMemo(() => {
    const routesKeys = Object.keys(routes);
    const routesArray = routesKeys.map((key) => routes[key]).flat();
    let existingPlansId = [] as any[];

    ['0', '1', '2', '3', '4', '5', '6'].forEach((id) => {
      const existPlanId = routesArray.find((route) => route.planID === id)?.planID;

      if (existPlanId && !existingPlansId.includes(id)) {
        existingPlansId.push({
          label: `Plan ID ${existPlanId}`,
          value: existPlanId,
        });
      }
    });

    return existingPlansId as Option[];
  }, [routes]);

  const valuePlanId = optionsPlanID.find((option) => option.value === planId) || null;

  const optionsDateRoute = useMemo(() => {
    const routesKeys = Object.keys(routes);
    const routesArray = routesKeys.map((key) => routes[key]).flat();

    const result = routesArray.filter((value) => {
      if (
        (value.routeID.toLowerCase().includes(search.toLowerCase()) ||
          value?.payload?.toLowerCase().includes(search.toLowerCase()) ||
          value?.includesJIT?.toString().toLowerCase().includes(search.toLowerCase()) ||
          value.city.toLowerCase().includes(search.toLowerCase())) &&
        value?.planID === planId
      ) {
        return true;
      } else return false;
    });

    return result
      .filter(
        (
          (el) => (f) =>
            !el.has(f.date) && el.add(f.date)
        )(new Set())
      )
      .map((option) => {
        return {
          value: option.date,
          label: option.date,
        };
      })
      .sort((a, b) => (dayjs(a.value).isAfter(dayjs(b.value)) ? 1 : -1));
  }, [search, planId, routes]);

  const optionsExtraPoints = useMemo(() => {
    const currentShipment = extraPoints.filter((route) => !route.truckID);

    const result = currentShipment.filter((value) => {
      if (
        (value.payload?.toLowerCase().includes(search.toLowerCase()) ||
          value?.includesJIT?.toString().toLowerCase().includes(search.toLowerCase()) ||
          value.city?.toLowerCase().includes(search.toLowerCase())) &&
        value.planID?.toLowerCase().includes(planId.toLowerCase())
      ) {
        return true;
      } else return false;
    });

    return result
      .filter(
        (
          (el) => (f) =>
            !el.has(f.date) && el.add(f.date)
        )(new Set())
      )
      .map((option) => {
        return {
          value: option.date,
          label: option.date,
        };
      })
      .sort((a, b) => (dayjs(a.value).isAfter(dayjs(b.value)) ? 1 : -1));
  }, [search, extraPoints, planId]);

  const valueRouteDate = useMemo(
    () => optionsDateRoute.find((option) => option.value === routeDate) || null,
    [optionsDateRoute, routeDate]
  );

  const valueExtraPointDate = useMemo(
    () => optionsExtraPoints.find((option) => option.value === extraPointDate) || null,
    [optionsExtraPoints, extraPointDate]
  );

  const optionsSortRoutes = options.routes.map((key) => ({
    label: `${key} `,
    value: key,
  }));

  const optionsSortExtraPoint = options.extraPoint.map((key) => ({
    label: `${key} `,
    value: key,
  }));

  const valueSortRoutes = sortRoute ? optionsSortRoutes.find((o) => o.value === sortRoute) : null;

  const valueSortExtraPoint = sortExtraPoint
    ? optionsSortExtraPoint.find((o) => o.value === sortExtraPoint)
    : null;

  const onChangePlanId = (option: Option | null) => {
    dispatch(filterActions.setPlanId(option ? option.value : ''));
  };

  const onChangeRouteDate = (option: Option | null) => {
    dispatch(filterActions.setRouteDate(option ? option.value : ''));
  };

  const onChangeExtraPointDate = (option: Option | null) => {
    dispatch(filterActions.setExtraPointDate(option ? option.value : ''));
  };

  const onChangeSortRoute = (option: any) => {
    dispatch(filterActions.setSortRoute(option ? option.value : null));
  };

  const onChangeSortExtraPoint = (option: any) => {
    dispatch(filterActions.setSortExtraPoint(option ? option.value : null));
  };

  const onMouseMove = (event: any) => {
    const x = positionBox.x + event.movementX;
    const y = positionBox.y + event.movementY;
    setPositionBox({ x, y });
  };

  /*переключение нажатия*/
  const togglePressed = () => {
    setPressed((prev) => !prev);
  };

  useEffect(() => {
    dispatch(filterActions.setSearch(debouncedSearch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    /*если нажат, вешаем обработчики перемещения, а также обработчик отжатия*/
    if (pressed) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', togglePressed);
    }

    return () => {
      /*не забываем обработчики удалять*/
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', togglePressed);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionBox, pressed]);

  return (
    <Box
      onClickCapture={() => setPressed(false)}
      onMouseDown={togglePressed}
      position="absolute"
      p={2}
      width="360px"
      borderRadius="10px"
      zIndex={9999}
      sx={{
        userSelect: 'none',
        ml: `${positionBox.x}px`,
        mt: `${positionBox.y}px`,
      }}
      bgcolor="white"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            placeholder="Route ID, jit, payload, city"
            size="small"
            label="Поиск"
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            onChange={(_: any, newValue: Option | null) => onChangePlanId(newValue)}
            options={optionsPlanID}
            size="small"
            value={valuePlanId}
            renderInput={(props) => <TextField {...props} label="Plan ID" fullWidth />}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            onChange={(_: any, newValue: Option | null) => onChangeRouteDate(newValue)}
            options={optionsDateRoute}
            size="small"
            value={valueRouteDate}
            renderInput={(props) => <TextField {...props} label="Рейсы" fullWidth />}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            onChange={(_: any, newValue: Option | null) => onChangeExtraPointDate(newValue)}
            options={optionsExtraPoints}
            size="small"
            value={valueExtraPointDate}
            renderInput={(props) => <TextField {...props} label="Грузы" fullWidth />}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            // eslint-disable-next-line react-hooks/exhaustive-deps
            onChange={useCallback((_: any, newValue: any) => onChangeSortRoute(newValue), [])}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            options={optionsSortRoutes}
            size="small"
            value={valueSortRoutes}
            // eslint-disable-next-line react-hooks/exhaustive-deps
            renderInput={useCallback(
              (props) => (
                <TextField {...props} label="Сортировка рейсов" fullWidth />
              ),
              []
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            // eslint-disable-next-line react-hooks/exhaustive-deps
            onChange={useCallback((_: any, newValue: any) => onChangeSortExtraPoint(newValue), [])}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            options={optionsSortExtraPoint}
            size="small"
            value={valueSortExtraPoint}
            // eslint-disable-next-line react-hooks/exhaustive-deps
            renderInput={useCallback(
              (props) => (
                <TextField {...props} label="Сортировка грузов" fullWidth />
              ),
              []
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="outlined" onClick={handleClose}>
            Закрыть
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export { Filters };
