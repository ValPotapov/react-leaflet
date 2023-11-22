import React, { useState, FC } from 'react'
import { useAppSelector } from '../../store';

import L from 'leaflet';
import Control from 'react-leaflet-custom-control'

import style from './style.module.css'

import { Menu, Stack, Tooltip, Fab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItemCar from './MenuItemCar';

interface ICustomLayerControl {
  // menuHeaderData?: ICompanyName,
  children?: React.ReactNode,
}
const CarsLayerControl: FC<ICustomLayerControl> = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuHeaderData = useAppSelector((state) => state.carsMap.companyName);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const controlStyle = {
    backgroundColor: 'rgb(7, 140, 117)',
    color: 'white',
    '&:hover': {
      backgroundColor: '#28c8aa'
    }
  }

  return (
    <div>
      <Control position='topleft' prepend={false} >
        <Tooltip title="Map settings">
          <Fab
            onClick={handleClick}
            size="small"
            sx={controlStyle}
            aria-controls={open ? 'map-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            // className={style.menuIconButton}
            data-control={'cars-menu'}
          >
            <MenuIcon />
          </Fab>
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
          <span className={style.menuCompanyName} id={String(menuHeaderData?.company_id)}>
            {menuHeaderData?.company_name}
          </span>
        </Stack>
        <Stack className={style.carsMenuBlock}>

          <MenuItemCar></MenuItemCar>

        </Stack>

      </Menu>

    </div>
  );
}

export default React.memo(CarsLayerControl);