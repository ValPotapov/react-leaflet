import React, { useState } from 'react'
import Control from 'react-leaflet-custom-control'

import { useAppSelector } from '../../store';

import { Tooltip, IconButton } from '@mui/material';
import HistoryMenu from './HistoryMenu';

import style from './style.module.css'

const HistoryLayerControl = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dataFromDateForm = useAppSelector((state) => state.carsMap.carsItemFromHistoryForm);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
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

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Control position='topleft' prepend={false} >
        <Tooltip title="History">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'History-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            className={style.menuIconButton}
          >
            {dataFromDateForm &&
              <HistoryMenu carData={newDataFromDateForm}></HistoryMenu>
            }
          </IconButton>
        </Tooltip>
      </Control>

    </div>
  );
}

export default HistoryLayerControl;