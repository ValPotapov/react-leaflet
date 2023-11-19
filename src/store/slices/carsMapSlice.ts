import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import carsPageconfig from '../../components/MainCars/lib/config';
import { TDataAboutCarForHistoryMenu, ICompanyData, IOneCarForMenu, ICompanyName, ICarsFilter, IDataFromDateForm } from "../../types/carsTypes";

type TypeCarsFilter = { [key: number]: boolean } | null;

type TypeCarsMapConfig = {
  variant: 'all' | 'history',
  userTimeOffset?: string,
}
// type TCarMapItem = {
//   car_id: string | number,
//   carName: string,
//   dataFromIso: string | '',
//   dataToIso: string | '',
//   localOffset: number,
// }

interface TypeInitialState {
  companyName: ICompanyName | null,
  forMenu: IOneCarForMenu[] | null | undefined,
  carsFilter: TypeCarsFilter,
  isConnectFilter: TypeCarsFilter,
  carsMapConfig: TypeCarsMapConfig,
  carsItemFromHistoryForm: TDataAboutCarForHistoryMenu | null
}


const initialState: TypeInitialState = {
  companyName: null,
  forMenu: null,
  carsFilter: null,
  isConnectFilter: null,
  carsMapConfig: { variant: 'all', userTimeOffset: carsPageconfig.defaultTimeLocaloffset },
  carsItemFromHistoryForm: null
}

export const carsMapSlice = createSlice({
  name: 'carsMap',
  initialState: initialState,
  reducers: {
    setCompanyName: (state, action: PayloadAction<ICompanyName>) => {
      state.companyName = { ...action.payload }
      // return state
    },
    setCarsDataForMenu: (state, action: PayloadAction<IOneCarForMenu[]>) => {
      state.forMenu = action.payload
      // return state
    },
    setChooseCheckbox: (state, action: PayloadAction<ICarsFilter>) => {
      state.forMenu = state.forMenu?.map((el: any, ind: any) => { //{carChoose_id: 2, carChoose_value: true} 
        if (Number(el.car_id) === Number(action.payload.carChoose_id)) {
          el.checked = action.payload.carChoose_value
        }
        return el
      })
      // return state
    },
    setCarsFilterMarkers: (state: any, action: PayloadAction<TypeCarsFilter>) => {
      state.carsFilter = { ...state.carsFilter, ...action.payload }
    },
    setCarsIsConnectFilter: (state: any, action: PayloadAction<TypeCarsFilter>) => {
      state.isConnectFilter = { ...state.isConnectFilter, ...action.payload }
      // return state
    },
    setCarsMapConfig: (state: any, action: PayloadAction<TypeCarsMapConfig>) => {
      state.carsMapConfig = { ...state.carsMapConfig, ...action.payload }
      // return state
    },
    setCarsItemFromHistoryForm: (state: any, action: PayloadAction<TDataAboutCarForHistoryMenu>) => {
      state.carsItemFromHistoryForm = { ...state.carsItemFromHistoryForm, ...action.payload }
      // return state
    },
  }
})

export const { actions: carsMapActions, reducer: carsMapReducer } = carsMapSlice;
