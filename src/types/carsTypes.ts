export interface ICompanyData {
  company_name: string,
  company_id: string | number,
  cars: ICarObject[]
}
export interface ICompanyName {
  company_name: string,
  company_id: string | number,
}

export interface ICarObject {
  car_id: number,
  car_name: string,
  lat: string | number,
  lng: string | number,
  angle: string | number,
  altitude: string | number,
  speed: string,
  pic: string,
  last_track: string | number
}

export interface IDataAllCarsForMenu {
  company_name: string,
  company_id: string | number,
  cars: IOneCarForMenu[]
}
export interface IOneCarForMenu {
  car_id: number,
  car_name: string,
  checked: boolean,
  disconnect: boolean,
}
export interface ICarsFilter {
  carChoose_id: number,
  carChoose_value: boolean,
}