import { ICompanyData } from "../../../types/carsTypes";

// https://user-headers.onrender.com/cars
// http://89.108.99.163/gps/gpsapi.php/all_cars?park_id=1
async function getCarsFetch(park_id: string, abortController: any): Promise<ICompanyData> {

  const apiCarsUrl = process.env.REACT_APP_API_URL_CARS;
  try {
    const response = await fetch(`${apiCarsUrl}?park_id=${park_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      },
      referrerPolicy: "unsafe-url",
      // signal: abortController.signal
    });


    if (response.ok) {
      const data: ICompanyData = await response.json();
      return data;
    } else {
      console.error('Ошибка при получении данных:', response.statusText);
      // Вернуть пустой объект или выбросить ошибку в зависимости от ваших потребностей
      return {
        company_name: 'noname',
        company_id: '0',
        cars: []
      };
    }
  } catch (error) {
    console.error('Произошла ошибка:', error);
    // Вернуть пустой объект или выбросить ошибку в зависимости от ваших потребностей
    abortController.abort();
    return {
      company_name: 'noname',
      company_id: '0',
      cars: []
    };
  }
}


export default getCarsFetch;