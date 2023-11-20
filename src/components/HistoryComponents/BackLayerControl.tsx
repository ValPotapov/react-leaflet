import React, { useState } from 'react'

import Control from 'react-leaflet-custom-control'

import { useAppDispatch, carsMapActions } from '../../store';

import { Tooltip, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import style from './style.module.css'

const BackLayerControl = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // const menuHeaderData = useAppSelector((state) => state.carsMap.companyName);
  const dispatch = useAppDispatch()
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(carsMapActions.setCarsMapConfig({ variant: 'all' }))
  };


  return (
    <>
      <Control position='topleft' prepend={false} >
        <Tooltip title="Back">
          <>
          <IconButton
              aria-label={'Back'}
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'History-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            className={style.menuIconButton}
            >
              <ArrowBackIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
          </>
        </Tooltip>
      </Control>
    </>
  );
}

export default BackLayerControl;