import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';

import { Box, Stack, CircularProgress } from '@mui/material';

import L from 'leaflet';
import 'leaflet-rotatedmarker';

import PainCars from './PainCars';
import getCarsFetch from './lib/fetchGetCars';
import style from './style.module.css'

import { ICarObject, ICompanyData } from '../../types/carsTypes';

export default function MainCars() {

  const [carsBounds, setCarsBounds] = useState<L.LatLngBoundsExpression | [] | any>()
  const [companyData, setCompanyData] = useState<ICompanyData | undefined>()

  //TODO Сделать проверку полученных первых данных и получаемых ежесекундно данных в <PainCars> 
  // на вероятность добавления данных о новом авто или исчезновении данных об авто
  // Если данные не соответсвуют(расходятся) то сделалть перерендер <MainCars> с новой отрисовкой всех
  // компонентов
  useEffect(() => {
    const companyData = getCarsFetch()
    companyData
      .then((data) => {
        const carBoundsArray = data.cars.map((car: ICarObject) => {
        return [parseFloat(String(car.lat)), parseFloat(String(car.lng))]
      })
        setCompanyData(data)
        L.control.zoom({ position: 'topright' })

      return setCarsBounds(carBoundsArray)
      })
      .catch((e) => console.log("Ошибка приполучении данных с сервера", e)
    )

  }, [])

  return !carsBounds ?
    (<Box display="flex" width="100%" height="100vh">
        <Stack display={'flex'} justifyContent={'center'} alignItems={'center'} margin={'auto'}>

          <CircularProgress color="inherit" className={style.carSpinner} />
        </Stack>
    </Box>)
        :

    (<Box display="flex" width="100%" height="100vh">
        <MapContainer
          // whenReady={() => { console.log("MAP READY") }}
          zoomSnap={0.5}
          zoomDelta={0.5}
          // bounds={[[54.8936466, 28.795824667646446], [53.943055, 27.4350899]]}
          // boundsOptions={{ padding: [50, 50] }}
          bounds={carsBounds}
          // bounds={[[53.943055, 27.4350899], [54.8936466, 27.5305566], [54.2314030446825, 28.795824667646446], [54.786238, 32.006855]]}
          // center={[53.943055, 27.4350899]}
        // zoom={8.5}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomControl position="topleft" />
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <PainCars mapBounds={carsBounds} carsDataStart={companyData} />
        </MapContainer>
    </Box>)

}