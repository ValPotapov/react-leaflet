import React, { FC } from 'react'

import Control from 'react-leaflet-custom-control'
import { useMap } from 'react-leaflet';

import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ICustomLayerControl {
  // menuHeaderData?: ICompanyName,
  children?: React.ReactNode,
}
const CustomZoom: FC<ICustomLayerControl> = () => {
  const map = useMap()

  const zoomStyle = {
    backgroundColor: 'rgb(7, 140, 117)',
    color: 'white',
    '&:hover': {
      backgroundColor: '#28c8aa'
    }
  }

  const zoomInHandler = () => {
    map.setZoom(map.getZoom() + 0.5);
  };

  const zoomOutHandler = () => {
    map.setZoom(map.getZoom() - 0.5);
  };

  return (
    <div>
      <Control position='topleft' prepend={false} >
        <Fab size="small" aria-label="zoom-in" sx={zoomStyle}
          onClick={zoomInHandler}
          data-control={'zoomIn'}>
          <AddIcon />
        </Fab>
      </Control>
      <Control position='topleft' prepend={false} >
        <Fab size="small" aria-label="zoom-out" sx={zoomStyle}
          onClick={zoomOutHandler}
          data-control={'zoomOut'}
        >
          <RemoveIcon />
        </Fab>
      </Control>

    </div>
  );
}

export default CustomZoom;