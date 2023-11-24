import React, { useState, FC } from 'react';
import { Stack, Checkbox, Box, FormControlLabel } from '@mui/material';
import { IOneCarForMenu } from '../../types/carsTypes';
import { IconDisconnect } from '../HistoryComponents/IconComponent/IconDisconnect';
import { useAppDispatch, useAppSelector, carsMapActions } from '../../store';

import style from './style.module.css'

interface IMenuItems {
  carData?: IOneCarForMenu,
}

const MenuItemCar: FC<IMenuItems> = React.memo(() => {

  const dispatch = useAppDispatch()
  const carsForMenuFromStore = useAppSelector((state) => state.carsMap?.forMenu);
  const carsIsConnectFilter = useAppSelector((state) => state.carsMap.isConnectFilter);


  const [isChecked, setIsChecked] = useState(true);

  const handleClose = (e: any) => {
    e.stopPropagation();
  }

  const checkboxChange = (e: any) => {
    setIsChecked((prev) => !prev);
    const carChoose_id: number = Number(e.target.id)
    const carChoose_value: boolean = e.target.checked
    dispatch(carsMapActions.setChooseCheckbox({ carChoose_id, carChoose_value }))
    dispatch(carsMapActions.setCarsFilterMarkers({ [carChoose_id]: carChoose_value }))
  }

  return (<div>
    {carsForMenuFromStore && carsForMenuFromStore?.map((carItem) => (
      <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-between'} key={`menuItem` + carItem.car_id}>
      <FormControlLabel
        control={
          <Checkbox
              checked={carItem.checked}
            onChange={checkboxChange}
              id={String(carItem.car_id)}
          />
        }
          label={carItem.car_name}
        onClick={handleClose}
        className={style.carsMenuLable}
      />
        {carsIsConnectFilter &&
        <Box className={style.menuDisconnectBox}>
          <IconDisconnect
            color={'black'}
              className={!carsIsConnectFilter[Number(carItem.car_id)] ? style.menuDisconnectIcon : style.menuIconNoneVisible}
          ></IconDisconnect>
        </Box>
      }
    </Stack>

    ))
    }
  </div>

  );
});

export default MenuItemCar;
