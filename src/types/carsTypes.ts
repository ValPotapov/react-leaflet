// Данные приходят с сервера 
export interface ICompanyData {
  company_name: string,
  company_id: string | undefined,
  cars: ICarObject[]
}

// Объект car приходит с сервера
export type ICarObject = {
  car_id: string,
  car_name: string,
  lat: string,
  lng: string,
  angle: string,
  altitude: string,
  speed: string,
  pic: string,
  last_track: string
}
// Для store
export type ICompanyName = {
  company_name: string,
  company_id: string | undefined,
}

// Для store для меню cars
export interface IDataAllCarsForMenu {
  company_name: string,
  company_id: string | undefined,
  cars: IOneCarForMenu[]
}
// данные одного car для store и carMenu
export type IOneCarForMenu = {
  car_id: string,
  car_name: string,
  checked: boolean,
  disconnect: boolean,
}
// Для store
export type ICarsFilter = {
  carChoose_id: number,
  carChoose_value: boolean,
}
// Данные приходят с сервера - история 
export type IHistoryDataFromServer = {
  from: string | null,
  to: string | null,
  car_id: string | null,
  history: IHistoryCar[],
  points: IHistoryPoints[]
}
// приходит с сервера массив таких объектов
export type IHistoryCar = {
  timestamp: string,
  lat: string,
  lng: string,
  altitude: string,
  angle: string,
  speed: string
}
// приходит с сервера массив таких объектов
export type IHistoryPoints = {
  name: string,
  lat: string,
  lng: string,
  radius: string
}
// Данные которые получаем с формы date history
export type IDataFromDateForm = {
  park_id: string | number
  park_name: string
  car_id: string | number,
  carName: string,
  dataFromIso: string,
  dataToIso: string,
  localOffset: number, //Разница местного часового пояса с мировым в минутах(3 часа -> 180)
}

export type TDataAboutCarForHistoryMenu = {
  company_name: string,
  company_id: string | undefined,
  car_id: string | number,
  car_name: string,
  dataFromIso: string,
  dataToIso: string,
  localOffset: string,
}
// 