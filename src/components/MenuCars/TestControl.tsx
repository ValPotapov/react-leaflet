import React, { useState, useEffect, FC, ReactComponentElement } from 'react'

// import L from 'leaflet';
import Control from 'react-leaflet-custom-control'

import style from './style.module.css'
import { ICarObject, ICompanyData, ICompanyName } from '../../types/carsTypes';

import { Menu, Stack, Tooltip, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItemsCars from './MenuItemCar';


interface ICustomLayerControl {
  menuHeaderData?: ICompanyName,
  children?: React.ReactNode,
}
const TestControl: FC<ICustomLayerControl> = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [carDataForMenu, setCarDataForMenu] = useState({})

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
  }, [])
  return (
    <React.Fragment>
      <Control position='topleft'>
        <Tooltip title="Map settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'map-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            className={style.menuIconButton}
          >
            <MenuIcon sx={{ width: 20, height: 20 }} className={style.menuIcon} />
          </IconButton>
        </Tooltip>
      </Control>
    </React.Fragment>
  );
}

export default TestControl;