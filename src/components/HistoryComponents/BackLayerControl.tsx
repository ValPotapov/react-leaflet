import React, { useState } from 'react'

import Control from 'react-leaflet-custom-control'

import { useAppDispatch, carsMapActions } from '../../store';

import { Fab } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const BackLayerControl = () => {

  const dispatch = useAppDispatch()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(carsMapActions.setCarsMapConfig({ variant: 'all' }))
  };

  const zoomStyle = {
    backgroundColor: 'rgb(7, 140, 117)',
    color: 'white',
    '&:hover': {
      backgroundColor: '#28c8aa'
    }
  }
  return (
    <>
      <Control position='topleft' prepend={false} >
        <Fab size="small" aria-label="control-back" sx={zoomStyle}
          onClick={handleClick}
          data-control={'control-back'}>
          <KeyboardBackspaceIcon />
        </Fab>
      </Control>
    </>
  );
}

export default BackLayerControl;