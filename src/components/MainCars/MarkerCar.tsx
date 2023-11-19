import { FC, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DateTime } from "luxon";


import { render } from 'react-dom';
import { Provider } from 'react-redux/es/exports';
import { renderToString } from 'react-dom/server'


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
  car: ICarObject
}
interface IiconImageSize {
  width: number;
  height: number;
}

const MarkerCar: FC<CarProps> = ({ car }) => {
  const map = useMap()
  const dispatch = useAppDispatch()
  let tooltipRef = useRef<any>(null)
  let tooltipHistoryRef = useRef<any>(null)

  const isMobile = useMemo(() => isHasToushScreen(), [])// mobile -> true ? PC -> false

  // const ConnectedHistoryMenu = connect((state) => state)(HistoryMenu);

  // const carsIsConnectFilter = useAppSelector((state) => state.carsMap.isConnectFilter);
  const carsFilter = useAppSelector((state) => state.carsMap.carsFilter);
  const carCompanyData = useAppSelector((state) => state.carsMap.companyName)
  // Что бы изменить размер картики нужно поменять только width
  const [imageSize, setImageSize] = useState<IiconImageSize>({ width: 16, height: 0 })
  const [tooltipHistoryOpen, setTooltipHistoryOpen] = useState(false)

  function timeDifference(dateString: string) {
    // Получаем время (с сервера) в миллисекундах по UTC (last_track: "2023-11-19 13:45:10")
    const timeLastTrack = DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss").toUTC()
    const timeLocalNow = DateTime.now().toUTC()
    const different = timeLocalNow < timeLastTrack.plus({ hour: carsPageconfig.differentTime })
    // console.log("---------2--------");
    // console.log(date);
    // console.log(DateTime.fromISO(date));

    const timeLastTrackMillis = DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss").toUTC().toMillis();
    // Получаем текущее время в миллисекундах по UTC
    const timeLocalNowMillis = DateTime.now().toUTC().toMillis()
    // const lastTrack = new Date(dateString)
    const dif = timeLocalNowMillis - timeLastTrackMillis
    const oneHour = carsPageconfig.differentTime // Значение в config.js

    return different // Если с последнего track прошло меньше [часа] - true иначе false
  }

  // Обработка событий мыши на маркере

  const mouseOverMarkerHandler = () => {
    if (!isMobile) {
      addNewTooltip()
      addHistoryTooltip()
    }
  }

  const mouseOutMarkerHandler = () => {
    removeNewTooltip()

  }

  const mouseClickMarkerHandler = () => {

    // Если mobile
    if (isMobile) {

      addNewTooltip()
      addHistoryTooltip()

    }
  }

  // Добавляем / Удаляем tooltip
  const addNewTooltip = () => {
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

    // Создаем div для портала
    const rootEl = document.getElementById('root')!;
    const portalContainer = document.createElement('div');
    rootEl.appendChild(portalContainer);

    // Создаем объект с данными об авто для передачи в HistoryMenu
    // TODO Оптимизировать, возможно вынести в Pane
    const dataAboutCar: TDataAboutCarForHistoryMenu = {
      company_id: carCompanyData?.company_id,
      company_name: carCompanyData?.company_name || 'noname',
      car_id: car.car_id,
      car_name: car.car_name,
      // полночь по местному
      dataFromIso: DateTime.local().startOf('day').toISO()?.slice(0, 16) || '',
      // местное время
      dataToIso: DateTime.local().toISO()?.slice(0, 16) || '',
      // местное смещение часовогот пояса в минутах
      localOffset: carsPageconfig.defaultTimeLocaloffset,
    }
    // Рендерим JSX-компонент внутри портала
    render(<Provider store={store}><HistoryMenu carData={dataAboutCar} /></Provider>, portalContainer);


    // Создаем tooltip для отображения скорости маркера
    const tooltipHistory = L.tooltip({
      pane: 'historyIconTooltipsPane',
      direction: 'left',
      className: [style.leafBorder, style.historyTooltip].join(' '),
      offset: [-10, -10],
      interactive: true,
      permanent: true
    })
      .setLatLng([Number(car.lat), Number(car.lng)])
      .setContent(portalContainer);
    // .setContent(renderToString(<IconHistory />))


    tooltipHistoryRef.current = tooltipHistory
    tooltipHistory.addTo(map)

    var el = tooltipHistory.getElement();

    tooltipHistory.options.permanent = true
    el?.addEventListener('click', function (e) {
      console.log(car.car_id);
    });

    tooltipHistory.on('click', function (e) {
      console.log(car.car_id);

      e.originalEvent.stopPropagation(); // Остановить событие клика
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
      // map.closePopup();
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