import { FC, useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { DateTime } from "luxon";

import { Provider } from 'react-redux/es/exports';
import { createRoot } from 'react-dom/client';

import { Marker as LeafletMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-rotatedmarker';

import { store } from '../../store'
import { useAppDispatch, useAppSelector, carsMapActions } from '../../store';
import { IconDisconnect } from '../HistoryComponents/IconComponent/IconDisconnect';
import isHasToushScreen from './lib/isMobile';
import carsPageconfig from './lib/config';
import getCarIconUrl from './lib/getCarIconUrl';

import { ICarObject, TDataAboutCarForHistoryMenu } from '../../types/carsTypes';

import HistoryMenu from '../HistoryComponents/HistoryMenu';

import style from './style.module.css';

interface CarProps {
  car: ICarObject,
  dataForHistory: TDataAboutCarForHistoryMenu,
}

const MarkerCar: FC<CarProps> = ({ car, dataForHistory }) => {

  const map = useMap()
  const dispatch = useAppDispatch()

  let tooltipSpeedRef = useRef<any>(null)
  let tooltipHistoryRef = useRef<any>(null)
  let portalContainerRef = useRef<any>(null)

  const isMobile = useMemo(() => isHasToushScreen(), [])// mobile -> true ? PC -> false

  // const carsIsConnectFilter = useAppSelector((state) => state.carsMap.isConnectFilter);
  const carsFilter = useAppSelector((state) => state.carsMap.carsFilter);

  const imageSize = carsPageconfig.carIconSize

  // const [imageSize, setImageSize] = useState<IiconImageSize>({ width: 16, height: 32 })
  const [tooltipHistoryOpen, setTooltipHistoryOpen] = useState(false)

  function timeDifference(dateString: string) {
    // Получаем время (с сервера) в миллисекундах по UTC (last_track: "2023-11-19 13:45:10")
    const timeLastTrack = DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss", { zone: carsPageconfig.defaultTimeLocaloffset }).toUTC()
    const timeLocalNow = DateTime.now().toUTC()
    const different: number = timeLocalNow.diff(timeLastTrack, 'hours').hours; // Разница в часах
    return different < carsPageconfig.differentTime// Если с последнего track прошло меньше [часа] - true иначе false
  }

  // Обработка событий мыши на маркере
  // для десктоп
  const mouseOverMarkerHandler = () => {
    if (!isMobile) {
      setTooltipHistoryOpen(true)
      addSpeedTooltip()
      addHistoryTooltip()
    }
  }

  const mouseOutMarkerHandler = () => {
    removeNewTooltip()
  }

  // Для мобильных
  const mouseClickMarkerHandler = () => {
    // Если mobile
    if (isMobile) {
      addSpeedTooltip()
      addHistoryTooltip()
    }
  }

  // Добавляем tooltip скорости
  const addSpeedTooltip = () => {
    // Создаем tooltip для отображения скорости маркера
    var tooltip = L.tooltip({
      direction: 'right',
      className: style.leafBorder,
      offset: [10, -10],
      interactive: true
    })
      .setLatLng([Number(car.lat), Number(car.lng)])
      .setContent(`скорость ${car.speed} км/ч`)

    tooltipSpeedRef.current = tooltip
    tooltip.addTo(map)
  }

  // Удаляем все открытые(все) tooltip с пано "historyTooltipsPane"
  const removeAllTooltips = () => {
    const pane = map.getPane('historyIconTooltipsPane');
    if (pane) {
      const allTooltip: HTMLCollection = pane.children;
      Array.from(allTooltip).forEach((element: Element) => {
        element.remove();
        // Ваши операции с элементом
      });
    }
  }

  const addHistoryTooltip = () => {
    // if (tooltipHistoryRef.current) tooltipHistoryRef.current.closeTooltip()
    removeAllTooltips()

    // setTooltipHistoryOpen(true)
    const tooltipHistory = L.tooltip({
      pane: 'historyIconTooltipsPane',
      direction: 'left',
      // className: [style.leafBorder, style.historyTooltip].join(' '),
      offset: [-10, -10],
      interactive: true,
      permanent: true
    })
      .setLatLng([Number(car.lat), Number(car.lng)])
      .setContent(portalContainerRef.current);
    // .setContent(renderToString(<IconHistory />))

    tooltipHistoryRef.current = tooltipHistory
    tooltipHistory.addTo(map)

    const el = tooltipHistory.getElement();

    tooltipHistory.options.permanent = true
    el?.addEventListener('click', function (e) {
    });

    tooltipHistory.on('click', function (e) {
      e.originalEvent.stopPropagation();
    });

  }


  const removeNewTooltip = () => {
    if (tooltipSpeedRef.current) {
      tooltipSpeedRef.current.remove()
    }
    tooltipSpeedRef.current = null
  }

  const removeHistoryTooltip = () => {
    setTooltipHistoryOpen(false)
    tooltipHistoryRef.current.remove()
    tooltipHistoryRef.current = null

  } 


  // Если true значит авто "в сети"
  const isConnection = timeDifference(String(car.last_track))

  function getImgUrl(id: string) {
    return (process.env.NODE_ENV === 'production') ? car.pic : getCarIconUrl(id)
  }


  // Каждый раз при рендере маркера в store ложаться(обновляются) ключи объекта isConnectFilter
  // Объект типа {car_id(id) : boolean(isConnection), ...}
  useEffect(() => {
    dispatch(carsMapActions.setCarsIsConnectFilter({ [Number(car.car_id)]: isConnection }))
  })

  // слушаем событие клик на карте если tooltip открыт
  // For mobile 
  map.on('click', useCallback((e: L.LeafletMouseEvent) => {
    const target = e.originalEvent.target as Element
    // L.DomEvent.disableClickPropagation(target)
    if (!target.classList.contains('leaflet-marker-icon')
      && !target.closest('.leaflet-tooltip')) {
      // Обработка клика за пределами маркера и tooltip(не в попапе)
      if (tooltipHistoryOpen && tooltipHistoryRef.current) {
        removeHistoryTooltip()
      }

    }
  }, [tooltipHistoryOpen]));

  // Отслеживаем именения checkbox выбора авто
  // Если меняется то удаляем все tootltips из pane: 'historyTooltipsPane'
  useEffect(() => {
    removeAllTooltips()
  }, [carsFilter]);

  useLayoutEffect(() => {
    // Рендерим JSX-компонент внутри портала
    // Создаем div для портала
    // const rootEl = document.getElementById('root')!;
    const portalContainer = document.createElement('div');
    // rootEl.appendChild(portalContainer);
    const root = createRoot(portalContainer);
    root.render(<Provider store={store}><HistoryMenu carData={dataForHistory} /></Provider>);

    portalContainerRef.current = portalContainer
  }, [])

  return (
    <LeafletMarker
      eventHandlers={{
        // add: () => console.log("MARKER ADD"),
        // loading: () => { console.log("MARKER READY") }
        mouseover: (e) => mouseOverMarkerHandler(),
        mouseout: (e) => mouseOutMarkerHandler(),
        click: (e) => {
          mouseClickMarkerHandler()
        }
      }}
      // data={`markerKey-${item.unicKey}`}
      pane={"carsMapPane"}
      // ref={tooltipSpeedRef}
      // title={`скорость ${car.speed} км/ч`}
      position={[Number(car.lat), Number(car.lng)]}
      rotationAngle={Number(car.angle)}
      rotationOrigin={'center'}
      riseOnHover

      icon={
        new L.Icon({
          iconUrl: getImgUrl(car.car_id),
          iconSize: [imageSize.width, imageSize.height],
          // iconAnchor: [16, 32],
          popupAnchor: [0, 0],
          shadowSize: [32, 32],
          shadowAnchor: [32, 72],
          // className: `${!isConnection && style.carIcon}`,

        })
      }
    >

      {/* Tooltip названия(имя) авто */}
      {imageSize.height && <Tooltip
        pane='carsMapPane'
        eventHandlers={{
          // add: () => onLoadTooltip()

        }}
        permanent={true}
        direction="bottom" offset={[0, imageSize.height / 2]} opacity={1}
        className={style.lfTooltip}
      >
        <div
          className={isConnection ? [style.carTooltip, style.carBgWhite].join(' ') : [style.carTooltip, style.carBgGrey].join(' ')}
        >
          {car.car_name}
          {!isConnection && <IconDisconnect className={style.tooltipSvg} />}
        </div>
      </Tooltip>}

      {/* Если mobile то будет рендер popup */}
      {/* <CustomPopup speed={car.speed} key={car.car_id}></CustomPopup> */}
    </LeafletMarker>
  )
};


export default MarkerCar