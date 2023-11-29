import { FC, useState, useEffect, useMemo, useLayoutEffect } from 'react';

import { Marker as LeafletMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-rotatedmarker';

import { useAppSelector } from '../../store';

import isHasToushScreen from '../MainCars/lib/isMobile';
import carsPageconfig from '../MainCars/lib/config';
import getCarsFetch from '../MainCars/lib/fetchGetCars';

import { ICarObject } from '../../types/carsTypes';
import { useSelector } from 'react-redux';
import getCarIconUrl from '../MainCars/lib/getCarIconUrl';

interface OneCarProps {
  carStartData: ICarObject,
}

const OneCarMarker: FC<OneCarProps> = ({ carStartData }) => {

  const imageSize = carsPageconfig.carIconSize
  const isMobile = useMemo(() => isHasToushScreen(), [])// mobile -> true ? PC -> false
  const carId = useAppSelector((state) => state.carsMap.carsItemFromHistoryForm?.car_id);
  const parc_id = useAppSelector((state) => state.carsMap.companyName?.company_id)

  const [oneCarData, setOneCarData] = useState<ICarObject>(carStartData)

  function getImgUrl(id: string) {
    return (process.env.NODE_ENV === 'production') ? oneCarData.pic : getCarIconUrl(id)
  }


  useEffect(() => {
    const abortController = new AbortController();
    const interval = setInterval(async () => {
      const carDataFromServer = await getCarsFetch(parc_id || '1', abortController)
      if (carDataFromServer) {
        const oneCarData = carDataFromServer.cars.find((el) => el.car_id === carId)!
        setOneCarData(oneCarData)
      }
    }, carsPageconfig.updateDelay)

    return () => {
      clearInterval(interval)
      abortController.abort();
    };

  }, [imageSize, carId]);


  return (
    oneCarData && <LeafletMarker
      eventHandlers={{
        /*         add: () => onLoadMarker(),
                loading: () => { console.log("MARKER READY") }
                mouseover: (e) => mouseOverMarkerHandler(),
                mouseout: (e) => mouseOutMarkerHandler(), */
        click: (e) => {
          // mouseClickMarkerHandler()
        }
      }}
      // data={`markerKey-${item.unicKey}`}
      pane={"OneCarMarker"}
      // ref={tooltipRef}
      // title={`скорость ${car.speed} км/ч`}
      position={[Number(oneCarData.lat), Number(oneCarData.lng)]}
      rotationAngle={90}
      rotationOrigin={'center'}
      riseOnHover

      icon={
        new L.Icon({
          iconUrl: getImgUrl(oneCarData.car_id),
          iconSize: [imageSize.width, imageSize.height],
          // iconAnchor: [16, 32],
          popupAnchor: [0, 0],
          shadowSize: [32, 32],
          shadowAnchor: [32, 72],
          // className: `${!isConnection && style.carIcon}`,

        })
      }
    >

    </LeafletMarker>
  )
}

export default OneCarMarker