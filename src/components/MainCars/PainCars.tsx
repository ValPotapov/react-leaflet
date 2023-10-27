import { useState, useEffect, useMemo, FC } from 'react';
import { Pane, useMap } from 'react-leaflet';

import L from 'leaflet';
import 'leaflet-rotatedmarker';
import { ICars } from '../../types/carsTypes';


import MarkerCar from './MarkerCar';
import getCarsFetch from './lib/fetchGetCars';
import carsPageconfig from './lib/config';
import isHasToushScreen from './lib/isMobile';

type IPainCars = L.LatLngBoundsExpression | [][] | any

const PainCars: FC<IPainCars> = ({ mapBounds, carsDataStart }) => {
  // mapBounds - массив массивов координат
  // carsDataStart - массив объектов с данными car

  const [carsData, setCarsData] = useState<ICars[]>(carsDataStart)
  const isMobile = useMemo(() => isHasToushScreen(), [])// mobile -> true ? PC -> false

  const map = useMap();

  // const updateMap = useCallback(() => {
  //   const actualBounds: IPainCars = getBoundsFromCarsData(carsData)
  //   map.panInsideBounds(actualBounds)
  //   // map.fitBounds(actualBounds)
  //   // setTimeout(() => {
  //   //   if (isMobile) map.zoomOut()
  //   //   map.panBy([0, carsPageconfig.offsetMapPan], { animate: true });
  //   // }, 300)
  // }, [map])

  // const updateMapWhenNoUser = useMemo(() => {
  //   return debounce(updateMap, carsPageconfig.updatePosMap)
  // }, [updateMap])

  // Получение данных с сервера
  useEffect(() => {
    const interval = setInterval(() => {

      getCarsFetch().then(data => setCarsData(data.cars))

    }, carsPageconfig.updateDelay);
    return () => clearInterval(interval);
  }, [map, mapBounds]);



  // // Подписываемся на событие изменения масштаба
  // useLayoutEffect(() => {
  //   map.on('zoom', updateMapWhenNoUser);
  //   map.on('moveend', updateMapWhenNoUser);

  //   // Отписываемся от события при размонтировании компонента
  //   return () => {
  //     map.off('zoom', updateMapWhenNoUser);
  //     map.off('moveend', updateMapWhenNoUser);
  //   };
  // }, [map, updateMapWhenNoUser]);


  // Смещение карты при первой загрузке на велечину тултипа
  useEffect(() => {
    map.whenReady(() => {
      if (isMobile) map.zoomOut()
      map.panBy([0, 28], { animate: true });
    })
  }, [map])

  return (
    <Pane name="myPane" style={{ zIndex: 500, width: '100vh', }}>
      {carsData && carsData.map((el: any) =>
        <MarkerCar car={el} key={`${el.car_id}-${el.last_track}`} />
      )}
    </Pane>
  )
}

export default PainCars;