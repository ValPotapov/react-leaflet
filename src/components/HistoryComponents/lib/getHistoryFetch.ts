import { IHistoryDataFromServer, TDataAboutCarForHistoryMenu } from "../../../types/carsTypes";
import { DateTime } from "luxon";

async function getHistoryFetch(carData: TDataAboutCarForHistoryMenu): Promise<IHistoryDataFromServer> {

  const parc_id = 1
  const { car_id, car_name, dataFromIso, dataToIso, localOffset } = { ...carData }
  const url = 'https://user-headers.onrender.com/history'

  // Формируем дату без учета часового пояса то есть если по местному 20-00
  // то и на сервер отправляем 20-00
  const from = DateTime.fromISO(dataFromIso).toFormat('yyyy-MM-dd HH:mm')
  const to = DateTime.fromISO(dataToIso).toFormat('yyyy-MM-dd HH:mm')
  const urlString = url + `?park_id=${parc_id}&car_id=${car_id}&from=${from}&to=${to}`

  // console.log("Данные для запроса с сервера");
  // console.log("---------------------------");
  // console.log("▶ ⇛ car_id:", car_id);
  // console.log("▶ ⇛ from:", from);
  // console.log("▶ ⇛ to:", to);
  // console.log("---------------------------");

  try {
    const response = await fetch(urlString, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      },
      referrerPolicy: "unsafe-url",
    });

    if (response.ok) {
      const data = await response.json();
      return data;

    } else {
      console.error('Ошибка при получении данных:', response.statusText);
      // Вернуть пустой объект или выбросить ошибку в зависимости от ваших потребностей
      return {
        from: null,
        to: null,
        car_id: null,
        history: [],
        points: []
      }
    }


  } catch (error) {
    console.error('Произошла ошибка:', error);
    // Вернуть пустой объект или выбросить ошибку в зависимости от ваших потребностей
    return {
      from: '',
      to: '',
      car_id: '',
      history: [],
      points: []
    }
  }
}


export default getHistoryFetch;