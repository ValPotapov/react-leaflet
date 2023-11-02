import React, { useState, useEffect, FC } from 'react'

// import L from 'leaflet';
import Control from 'react-leaflet-custom-control'

import style from './style.module.css'
import { ICompanyName } from '../../types/carsTypes';

import { Menu, Stack, Tooltip, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


interface ICustomLayerControl {
  menuHeaderData: ICompanyName,
  children: React.ReactNode,
}
const CustomLayerControl: FC<ICustomLayerControl> = ({ menuHeaderData, children }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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


      <Menu
        anchorEl={anchorEl}
        id="map-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 14,
              // right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Stack display={'flex'} justifyContent={'centr'} margin={'auto'}>
          <span className={style.menuCompanyName} id={String(menuHeaderData.company_id)}>
            {menuHeaderData.company_name}
          </span>
        </Stack>
        <Stack className={style.carsMenuBlock}>
          {children}
          {/* {companyData && [...companyData.cars].map((carData) =>
            (<MenuItemsCars carData={carData} key={`menulist` + carData.car_id}></MenuItemsCars>)
          )} */}
        </Stack>

      </Menu>

    </React.Fragment>
  );
}

export default CustomLayerControl;