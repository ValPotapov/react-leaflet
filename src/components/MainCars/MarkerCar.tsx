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

import { ICarObject, TDataAboutCarForHistoryMenu } from '../../types/carsTypes';

import HistoryMenu from '../HistoryComponents/HistoryMenu';

import style from './style.module.css';

interface CarProps {
  car: ICarObject,
  dataForHistory: TDataAboutCarForHistoryMenu,
}
interface IiconImageSize {
  width: number;
  height: number;
}

const MarkerCar: FC<CarProps> = ({ car, dataForHistory }) => {
  const map = useMap()
  const dispatch = useAppDispatch()
  let tooltipRef = useRef<any>(null)
  let tooltipHistoryRef = useRef<any>(null)
  let portalContainerRef = useRef<any>(null)

  const isMobile = useMemo(() => isHasToushScreen(), [])// mobile -> true ? PC -> false

  // const carsIsConnectFilter = useAppSelector((state) => state.carsMap.isConnectFilter);
  const carsFilter = useAppSelector((state) => state.carsMap.carsFilter);

  // Что бы изменить размер картики нужно поменять только width
  const [imageSize, setImageSize] = useState<IiconImageSize>({ width: 16, height: 0 })
  const [tooltipHistoryOpen, setTooltipHistoryOpen] = useState(false)

  function timeDifference(dateString: string) {
    // Получаем время (с сервера) в миллисекундах по UTC (last_track: "2023-11-19 13:45:10")
    const timeLastTrack = DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss", { zone: carsPageconfig.defaultTimeLocaloffset }).toUTC()
    const timeLocalNow = DateTime.now().toUTC()
    const different: number = timeLocalNow.diff(timeLastTrack, 'hours').hours; // Разница в часах
    return different < carsPageconfig.differentTime// Если с последнего track прошло меньше [часа] - true иначе false
  }

  // Обработка событий мыши на маркере

  const mouseOverMarkerHandler = () => {
    if (!isMobile) {
      addSpeedTooltip()
      addHistoryTooltip()
    }
  }

  const mouseOutMarkerHandler = () => {
    removeNewTooltip()
  }

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

    tooltipRef.current = tooltip
    tooltip.addTo(map)
  }

  // Удаляем все открытые(все) tooltip с пано "historyTooltipsPane"
  const removeAllTooltips = () => {
    const allTooltip: any = map.getPane('historyIconTooltipsPane')?.children;

    if (allTooltip) {
      Array.from(allTooltip).forEach((element: any) => {
        element.remove()
        // Ваши операции с элементом
      });
    }

  }

  const addHistoryTooltip = () => {
    // if (tooltipHistoryRef.current) tooltipHistoryRef.current.closeTooltip()
    removeAllTooltips()

    setTooltipHistoryOpen(true)

    // Создаем tooltip иконка истории (HistoryMenu)
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

    var el = tooltipHistory.getElement();

    tooltipHistory.options.permanent = true
    el?.addEventListener('click', function (e) {
    });

    tooltipHistory.on('click', function (e) {
      e.originalEvent.stopPropagation();
    });

  }


  const removeNewTooltip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.remove()
    }
    tooltipRef.current = null
  }

  const removeHistoryTooltip = () => {
    setTooltipHistoryOpen(false)
    tooltipHistoryRef.current.remove()
    tooltipHistoryRef.current = null

  } 


  useLayoutEffect(() => {
    // Рендерим JSX-компонент внутри портала
    // Создаем div для портала
    const rootEl = document.getElementById('root')!;
    // const portalContainer = document.createElement('div');
    const portalContainer = document.createElement('div');
    rootEl.appendChild(portalContainer);
    const root = createRoot(portalContainer);
    root.render(<Provider store={store}><HistoryMenu carData={dataForHistory} /></Provider>);
    portalContainerRef.current = portalContainer
  }, [])

  // Если true значит авто "в сети"
  const isConnection = timeDifference(String(car.last_track))

  function getImgUrl(id: number) {
    if (Number(id) === 1) return process.env.PUBLIC_URL + '/img/car1.png'
    if (Number(id) === 2) return process.env.PUBLIC_URL + '/img/car2.png'
    if (Number(id) === 33) return process.env.PUBLIC_URL + '/img/car3.png'
    return ''
  }

  useEffect(() => {
    var img = new Image();
    img.src = getImgUrl(car.car_id)

    img.onload = function () {
      var width = img.width;
      var height = img.height;
      const proportions = Math.round(height / width)
      setImageSize({ ...imageSize, height: imageSize.width * proportions })
    };

  }, [])

  // Каждый раз при рендере маркера в store ложаться(обновляются) ключи объекта isConnectFilter
  // Объект типа {car_id(id) : boolean(isConnection), ...}
  useEffect(() => {
    dispatch(carsMapActions.setCarsIsConnectFilter({ [Number(car.car_id)]: isConnection }))
  })

  // слушаем событие клик на карте если tooltip открыт
  // For mobile 
  map.on('click', useCallback((e: any) => {
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

  return (
    <LeafletMarker
      eventHandlers={{
        // add: () => onLoadMarker(),
        // loading: () => { console.log("MARKER READY") }
        mouseover: (e) => mouseOverMarkerHandler(),
        mouseout: (e) => mouseOutMarkerHandler(),
        click: (e) => {
          mouseClickMarkerHandler()
        }
      }}
      // data={`markerKey-${item.unicKey}`}
      pane={"carsMapPane"}
      // ref={tooltipRef}
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
}

export default MarkerCar