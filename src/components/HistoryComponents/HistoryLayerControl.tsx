import Control from 'react-leaflet-custom-control'

import { useAppSelector } from '../../store';

import { Tooltip } from '@mui/material';
import HistoryMenu from './HistoryMenu';

import style from './style.module.css'
const HistoryLayerControl = () => {

  const dataFromDateForm = useAppSelector((state) => state.carsMap.carsItemFromHistoryForm);


  const newDataFromDateForm = {
    ...dataFromDateForm,
    company_id: dataFromDateForm?.company_id || '0',
    company_name: dataFromDateForm?.company_name || 'noname',
    dataFromIso: dataFromDateForm!.dataFromIso.slice(0, 16),
    dataToIso: dataFromDateForm!.dataToIso.slice(0, 16),
    car_id: dataFromDateForm?.car_id || '0',
    car_name: dataFromDateForm?.car_name || '',
    localOffset: dataFromDateForm?.localOffset || '0',

  }

  return (
    <>
      <Control position='topleft' prepend={false}>
        <Tooltip title="History">
          <>
            <HistoryMenu
              carData={newDataFromDateForm}
              className={[style.menuIconButton, style.cars_history_map].join(' ')}
            />
          </>
        </Tooltip>
      </Control>

    </>
  );
}

export default HistoryLayerControl;