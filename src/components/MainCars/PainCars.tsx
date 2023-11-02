import { useState, useEffect, useMemo, FC } from 'react';
import { Pane, useMap } from 'react-leaflet';

import { useAppDispatch, useAppSelector, carsMapActions } from '../../store';

import L from 'leaflet';
import 'leaflet-rotatedmarker';
import { ICarObject, ICompanyData, ICompanyName } from '../../types/carsTypes';

import MarkerCar from './MarkerCar';
import getCarsFetch from './lib/fetchGetCars';
import carsPageconfig from './lib/config';
import isHasToushScreen from './lib/isMobile';

import CustomLayerControl from '../MenuCars/CustomLayerControl';
// import TestControl from '../MenuCars/TestControl';
import MenuItemCar from '../MenuCars/MenuItemCar';

type IPainCars = L.LatLngBoundsExpression | [][] | any

const PainCars: FC<IPainCars> = ({ mapBounds, carsDataStart }) => {
  // mapBounds - массив массивов координат для определения расположения видимой карты
  // carsDataStart - массив объектов с данными cars для первого рендере

  const dispatch = useAppDispatch()
  const carsForMenuFromStore = useAppSelector((state) => state.carsMap?.forMenu);
  const carsFilterObject = useAppSelector((state) => state.carsMap.carsFilter);

  // console.log("▶ ⇛ carsForMenuFromStore:", carsForMenuFromStore);

  const [companyData, setCompanyData] = useState<ICompanyData>(carsDataStart)
  const isMobile = useMemo(() => isHasToushScreen(), [])// mobile -> true ? PC -> false

  const map = useMap();

  // Формируем массив для передачи в Marker перед фильтром
  // Обновляется каждую секунду
  const dataCarsForMarrkers = [...companyData?.cars]
  // const dataCarsForMarrkers = setCompanyData((curr) => curr)?.cars// [...companyData?.cars]


  // Данные для меню - Названии коипании и Id
  // Стабильны обновляются только при обновлении карты
  const menuHeaderData: ICompanyName = useMemo(() => ({
    company_name: companyData.company_name,
    company_id: companyData.company_id
  }), [])

  // Формируем массив обьектов для передачи в MenuItem
  const getdataForMenuItem = (company: ICompanyData) => {

    const dataCarsForMenuItems = company.cars.map((car: ICarObject) => ({
      car_id: car.car_id,
      car_name: car.car_name,
      checked: true,
      disconnect: false,
    })
    )
    return dataCarsForMenuItems;
  };

  // Фильтр для передачи в Marker (принимает маасив объектов Cars и возвращает все где checked true)

  const filterForMarkers = dataCarsForMarrkers.filter((el: ICarObject) => {
    if (carsFilterObject && carsFilterObject[el.car_id] === true) return el
  })

  const makeFilterObject = (carsData: any) => {
    const dataObj: any = {}
    carsData.forEach((el: any) => {
      dataObj[el.car_id] = true

    })
    return dataObj
  }

  const dataForMenuItem = useMemo(() => getdataForMenuItem(companyData), [carsDataStart])

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
      getCarsFetch()
        .then(data => {
          setCompanyData(data)
        })

    }, carsPageconfig.updateDelay);
    return () => clearInterval(interval);
  }, [map, mapBounds]);

  useEffect(() => {
    dispatch(carsMapActions.setCompanyName(menuHeaderData))
    dispatch(carsMapActions.setCarsDataForMenu(dataForMenuItem))
    dispatch(carsMapActions.setCarsFilterMarkers(makeFilterObject(carsDataStart.cars)))
  }, [carsDataStart, dispatch])

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
    <>
      {companyData &&

        <CustomLayerControl menuHeaderData={menuHeaderData} key={menuHeaderData.company_id}>

          {carsForMenuFromStore && carsForMenuFromStore.map((carData) =>
            (<MenuItemCar carData={carData} key={`menuItem` + carData.car_id}></MenuItemCar>)
          )}

        </CustomLayerControl>}
      {/* <TestControl></TestControl> */}
    <Pane name="myPane" style={{ zIndex: 500, width: '100vh', }}>

        {companyData && filterForMarkers.map((el: any) => {
          return <MarkerCar car={el} key={`${el.car_id}-${el.last_track}`} />
        }
        )}

    </Pane>
    </>
  )
}

export default PainCars;