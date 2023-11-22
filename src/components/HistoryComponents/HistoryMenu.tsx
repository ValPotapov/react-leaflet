import React, { FC, useState } from 'react';
import { DateTime } from "luxon";

import { useAppDispatch, carsMapActions } from '../../store';
import carsPageconfig from '../MainCars/lib/config';

import { TDataAboutCarForHistoryMenu } from '../../types/carsTypes';

import { Menu, Typography, Divider, Stack, Button, Fab } from '@mui/material/';
import RestoreIcon from '@mui/icons-material/Restore';
import { TextField } from '@mui/material/';
import { IconCar } from './IconComponent/IconCar';


interface IHistoryMenuProps {
  carData: TDataAboutCarForHistoryMenu,
  className?: string,
}


const HistoryMenu: FC<IHistoryMenuProps> = ({ carData, className }) => {

  const dispatch = useAppDispatch()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [dateMsForState, setDateForState] = useState<string | any>(carData.dataFromIso || '')
  const [datMsToState, setDateToState] = useState<string | any>(carData.dataToIso || '')

  const [validDateCompare, setValidDateCompare] = useState(true)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // Получаем время и устанавливаем в state
    // формат '2023-11-12T23:15'
    setDateForState(carData.dataFromIso)
    setDateToState(carData.dataToIso)

  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Сравнение дат от и до по умолчанию (60 * 1000 - 1 минута)
  const compareDate = (dateOne: string, dateTwo: string) => {
    // '2023-11-12T00:00'
    const dateFor = DateTime.fromISO(dateOne).toMillis()
    const dateTo = DateTime.fromISO(dateTwo).toMillis()
    return (dateTo - dateFor) >= carsPageconfig.dateCompareTime
  }

  const handleChooseDateFor = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const selectedDateFor = event.target.value;

    setDateForState((current: any) => current = selectedDateFor)
    setValidDateCompare(compareDate(selectedDateFor, datMsToState))

  }

  const handleChooseDateTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const selectedDateTo = event.target.value;
    setDateToState((current: string) => selectedDateTo)
    setValidDateCompare(compareDate(dateMsForState, selectedDateTo))
  }

  const onSubmitHandler = (e: any) => {
    e.preventDefault()
    // Формируем даты по местному времени(которое указали в input)
    // с присвоением часового пояса, в формате ISO
    // Для добавления в Store
    const dataFromDateForm: TDataAboutCarForHistoryMenu = {
      company_id: e.target.dataset.parcid,
      company_name: e.target.dataset.parcname,
      car_id: e.target.dataset.carid,
      car_name: e.target.dataset.carname,
      dataFromIso: DateTime.fromISO(e.target.dateFrom.value).toISO() || '',
      dataToIso: DateTime.fromISO(e.target.dateTo.value).toISO() || '',
      localOffset: String(DateTime.local().offset)
    }
    dispatch(carsMapActions.setCarsMapConfig({ variant: 'history' }))
    dispatch(carsMapActions.setCarsItemFromHistoryForm(dataFromDateForm))

    handleClose()
  }

  const textField_from = () => {
    return (

      <TextField
        name="dateFrom"
        label="Дата от"
        InputLabelProps={{ shrink: true, required: true }}
        type="datetime-local"
        // defaultValue={dateServices.getTimeForDefaultValueInput(dateServices.getMsMidnight())}
        value={dateMsForState}
        inputProps={{ max: DateTime.local().toISO()?.slice(0, 16) }}
        size="small"
        onChange={handleChooseDateFor}
        error={!validDateCompare}
      />
    )
  }
  const textField_to = () => {
    return (
      <TextField
        name="dateTo"
        label="Дата до"
        InputLabelProps={{ shrink: true, required: true }}
        type="datetime-local"
        // defaultValue={dateServices.getTimeForDefaultValueInput(Date.now())}
        value={datMsToState}
        size="small"
        inputProps={{ max: DateTime.local().toISO()?.slice(0, 16) }}
        onChange={handleChooseDateTo}
        error={!validDateCompare}

      />
    )
  }

  const zoomStyle = {
    backgroundColor: 'rgb(7, 140, 117)',
    color: 'white',
    '&:hover': {
      backgroundColor: '#28c8aa'
    }
  }

  return (

    <div>
      <Fab
        aria-label={'History'}
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        // className={className}
        data-control={'control-history'}
        sx={zoomStyle} 
      >
        <RestoreIcon />
      </Fab>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: { xs: "90%", sm: "auto", md: "auto" },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Stack display={'flex'} flexDirection={'row'} justifyContent={'start'}>
          <Typography variant="subtitle2" marginLeft={'10px'}>{carData.company_name}</Typography>
        </Stack>
        <Divider />

        <Stack
          display={'flex'} flexDirection={'row'} justifyContent={'space-between'}
          sx={{
            margin: '8px 16px'
          }}
        >
          <Typography variant="h6">История</Typography>

          <Stack display={'flex'} flexDirection={'row'} justifyContent={'center'}
            gap={'20px'} alignItems={'center'}>
            <Typography variant="subtitle2">{carData.car_name}</Typography>
            <IconCar size='20px'></IconCar>
          </Stack>

        </Stack>

        <Divider />
        <Stack display={'flex'} flexDirection={'column'} gap={'5px'} m={'10px'} >
          <form name={'dateForm'} action='/cars'
            onSubmit={onSubmitHandler}
            data-parcid={carData.company_id}
            data-parcname={carData.company_name}
            data-carid={carData.car_id}
            data-carname={carData.car_name}
          >

            <Stack display={'flex'} flexDirection={'row'} gap={'20px'} m={'10px'}
              sx={{
                justifyContent: { xs: 'center', sm: 'space-between' }
              }}
            >
              <Stack display={'flex'} alignItems={'center'} justifyContent={'center'}>
                От
              </Stack>
              {textField_from()}
            </Stack>

            <Stack display={'flex'} flexDirection={'row'} gap={'20px'} m={'10px'}
              sx={{
                justifyContent: { xs: 'center', sm: 'space-between' }
              }}
            >
              <Stack display={'flex'} alignItems={'center'} justifyContent={'center'}>
                До
              </Stack>
              {textField_to()}
            </Stack>

            <Stack>
              <Button
                disabled={!validDateCompare} type="submit"
                // variant="outlined"
                variant="contained"
                style={{ width: '60%', margin: 'auto', backgroundColor: 'rgb(7, 140, 117)' }}>Показать
              </Button>
            </Stack>
          </form>
        </Stack>
      </Menu>
    </div>
  );
}


export default HistoryMenu 