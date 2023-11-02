import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDataAllCarsForMenu, ICompanyData, IOneCarForMenu, ICompanyName, ICarsFilter } from "../../types/carsTypes";

type TypeCarsFilter = { [key: number]: boolean } | null;

type TypeInitialState = {
  companyName: ICompanyName | null,
  forMenu: IOneCarForMenu[] | null | undefined,
  carsFilter: TypeCarsFilter,
  isConnectFilter: TypeCarsFilter,
}

const initialState: TypeInitialState = {

  companyName: null,
  forMenu: null,
  carsFilter: null,
  isConnectFilter: null,
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
  }
})

export const { actions: carsMapActions, reducer: carsMapReducer } = carsMapSlice;
// // Два export !!
// export default carsMapSlice.reducer

// // Экспортируем экшены
// export const { setCarsData } = carsMapSlice.actions