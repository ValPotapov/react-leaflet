export interface ICarServerData {
  company_name: string,
  company_id: string | number,
  cars: ICars[]
}

export interface ICars {
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