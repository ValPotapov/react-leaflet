import { useState, useEffect, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Pane, useMap, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-rotatedmarker';

import { useAppSelector } from '../../store';
import getHistoryFetch from './lib/getHistoryFetch';
import isHasToushScreen from '../MainCars/lib/isMobile';
import carsPageconfig from '../MainCars/lib/config';
import zoomOutHandler from '../MainCars/lib/zoomOut';

import { TDataAboutCarForHistoryMenu, IHistoryDataFromServer, IHistoryPoints, IHistoryCar } from '../../types/carsTypes';

import { Spinner } from './IconComponent/Spinner';
import LayerPoints from './LayerPoints';
import LayersHistoryMarkers from './LayersHistoryMarkers';
import HistoryLayerControl from './HistoryLayerControl';
import BackLayerControl from './BackLayerControl';
// type IPainCars = L.LatLngBoundsExpression | [][] | any

const PaneHistoryMap = () => {

  const [dataFromServer, setDataFromServer] = useState<IHistoryDataFromServer | null>(null)
  const [pointsBounds, setPointsBounds] = useState<IHistoryPoints[] | []>([])
  const [forFitBounds, setForFitBounds] = useState<L.LatLngBoundsExpression | [][] | any>(null)

  const [historyDataLoad, setHistoryDataLoad] = useState(false)

  const polilineRef = useRef<L.Polyline | null>(null)

  const carsItemFromHistoryForm = useAppSelector((state) => state.carsMap?.carsItemFromHistoryForm);

  const isMobile = useMemo(() => isHasToushScreen(), [])// mobile -> true ? PC -> false

  const map = useMap();


  // Получаем данные с сервера в запросе отправляем данные с формы menuHistory
  // данные с формы получаем из store - carsMapHistotyItem
  // {car_id: "33"
  // carName: "Ларгус Иванов"
  // dataFromIso: "2023-11-13T18:10:00.000+07:00"
  // dataToIso: "2023-11-13T18:17:00.000+07:00"
  // localOffset: 420}
  // ---------------------------
  // С сервера приходят массивы объектов history :
  //
  // {altitude: "231"
  // angle: "232"
  // lat: "53.8827183"
  // lng: "27.5219233"
  // speed: "0"
  // timestamp: "2023-11-13 00:30:19"}
  //
  //
  // массивы points  :[[],[]]
  // {lat: "53.882645"
  // lng: "27.5217466"
  // name: "home"
  // radius: "100"}

  function dilutionArrayPoints(arr: IHistoryCar[], num: number) { // num на сколько "разбавляем" 

    return arr.filter((el: IHistoryCar, ind: number, arr) => {
      if (ind === 0 || ind === arr.length - 1) return el
      if (ind % num === 0) return el
    })
  }


  async function historyFetchHandler(data: TDataAboutCarForHistoryMenu) {
    // получаем данные с сервера оправляем данные с формы из store
    // Получим либо данные либо пустой объект сформированный в getHistoryFetch
    const historyServerData = await getHistoryFetch(data)

    if (!historyServerData.car_id) {
      // ошибка нет car_id в ответе с сервера
      errorHandler("Нет car_id")
      setHistoryDataLoad(true)
      return
    }
    if (historyServerData.history.length === 0 && historyServerData.points.length === 0) {
      // нет данных 
      errorHandler("оба массива (history и points) пусты")
      setHistoryDataLoad(true)
      return
    }
    // формируем координаты границ панораммы карты (min max)
    const coordHistoryToFitBounds = arrayPointsForBoundsSort(historyServerData.history)
    const coordPointsToFitBounds = arrayPointsForBoundsSort(historyServerData.points)
    coordHistoryToFitBounds.push(...coordPointsToFitBounds)

    const filterArrayExcludeZero = (array: IHistoryCar[]) => array.filter((el) => {
      if (Number(el.lat) > 0 && Number(el.lng) > 0) return el
    })

    if (historyServerData.history.length > 0) {
      try {
        // массив отфилтрованных объектов Истории передвижения(исключили объекты с нулевыми координатами)
        historyServerData.history = [...filterArrayExcludeZero(historyServerData.history)]

        // ? Здесь возможно разбавление массива координат
        if (isMobile && carsPageconfig.isdilution) historyServerData.history = [...dilutionArrayPoints(historyServerData.history, carsPageconfig.dilutionArrayCount)]


        // Создаем линии
        const lineArray: L.LatLngExpression[] = historyServerData?.history.map((el) => [Number(el.lat), Number(el.lng)])!
        const polyline = L.polyline(lineArray, {
          color: 'red',
          weight: carsPageconfig.historyLineWeight,
          lineCap: 'square',
          pane: 'historyMapPane-line',
          // dashArray: '20, 5' // пунктир
        })
        polilineRef.current = polyline

      } catch (error) {
        console.log("Ошибка при удалении нулевых координат в .history[]");
        console.log("Или при создании полилиний");
        console.log(error);

      }
    }
    setPointsBounds(historyServerData.points)
    setDataFromServer(historyServerData)
    setForFitBounds(coordHistoryToFitBounds)

  }


  function errorHandler(msg: string) {
    console.warn("ERROR -->", msg);

  }

  function arrayPointsForBoundsSort(arr: any) {
    // let result : number[][] = []
    if (arr.length === 0) return []
    const result = arr.reduce(
      (acc: number[][], obj: any) => {
        const lat = parseFloat(obj.lat);
        const lng = parseFloat(obj.lng);

        if (lat > 0 && lng > 0) {
          if (!isNaN(lat) && !isNaN(lng)) {
            // Находим максимальные значения
            acc[0][0] = Math.max(acc[0][0], lat);
            acc[0][1] = Math.max(acc[0][1], lng);
          // Находим минимальные значения
            acc[1][0] = Math.min(acc[1][0], lat);
            acc[1][1] = Math.min(acc[1][1], lng);
          }
        }

        return acc
      },
      [
        [-Infinity, -Infinity], // Максимальные значения lat и lng
        [Infinity, Infinity]   // Минимальные значения lat и lng
      ]
    );

    return result
  }

  useEffect(() => {
    if (carsItemFromHistoryForm) {
      historyFetchHandler(carsItemFromHistoryForm)
    }
    return () => {
      polilineRef.current?.remove()
      polilineRef.current = null
      setHistoryDataLoad(false)
    }
  }, [carsItemFromHistoryForm])

  useEffect(() => {
    // После отрисовки всех компонентов истории
    map.whenReady(() => {
      if (forFitBounds && forFitBounds.length > 0) {
          // map.fitBounds(forFitBounds)
        // map.options.zoomSnap = 0.5
        // map.options.zoomDelta = 0.5
        // console.log("Zoom Min", map.getMinZoom());
        // console.log("Zoom Max", map.getMaxZoom());
        // console.log("getBoundsZoom", map.getBoundsZoom(forFitBounds));
        //   console.log("getCenter()", map.getCenter());
        map.fitBounds(forFitBounds)
        zoomOutHandler(map)
        // map.setView(map.getCenter())
        // map.setZoom(9.5)
        // map.zoomOut(-1)
        // map.setZoomAround(map.getCenter(), 9.5)
        // const zoomOut: HTMLButtonElement | null = document.querySelector('.leaflet-control-zoom-out')

        setTimeout(() => {
          // zoomOut?.click()
          setHistoryDataLoad(true)
        }, 300)
        // Добавляем линии на карту
        polilineRef.current?.addTo(map)
      }
    })

  }, [forFitBounds])

  // Удаляем Control
  useEffect(() => {
    return () => {
      try {
        // Удаляем кнопки control  
        // const backElement = document.querySelector('[aria-label="Back"]')?.closest('.leaflet-control');
        // const historyElement = document.querySelector('[aria-label="History"]')?.closest('.leaflet-control');
        const backElement = document.querySelector('[data-control="control-back"]')?.closest('.leaflet-control');
        const historyElement = document.querySelector('[data-control="control-history"]')?.closest('.leaflet-control');
        backElement?.remove()
        historyElement?.remove()
      } catch (error) {
        console.warn("Не удалось удалить control", error);
      }
    }
  }, [map, carsItemFromHistoryForm]);


  return (
    <div>
      <BackLayerControl></BackLayerControl>
      <HistoryLayerControl></HistoryLayerControl>

      {!historyDataLoad && <Spinner />}
      <>
      <Pane name="historyMapPane-circleTooltip" style={{ zIndex: 500, width: '100vh', }} />

      <LayerGroup pane='historyMapPane-circleTooltip'>
        {pointsBounds.length && pointsBounds.map((pointItem) => (
          <LayerPoints key={pointItem.name} pointItem={pointItem}></LayerPoints>
        ))}
      </LayerGroup>

        <Pane name="historyMarkerPane" style={{ zIndex: 500, width: '100vh', }}></Pane>
        {/* <LayerGroup> */}
            {dataFromServer?.history.length! > 0 && dataFromServer?.history.map((historyItem) => (
            <LayersHistoryMarkers key={uuidv4()} historyFromServer={historyItem}></LayersHistoryMarkers>
          ))}
        {/* </LayerGroup> */}

        <Pane name='historyMapPane-line' style={{ width: '100vh', }}></Pane>
      </>

    </div>
  )
}

export default PaneHistoryMap;