const getCarIconUrl = (id: string): string => {

  if (Number(id) === 1) return process.env.PUBLIC_URL + '/img/car1.png'
  if (Number(id) === 2) return process.env.PUBLIC_URL + '/img/car2.png'
  if (Number(id) === 33) return process.env.PUBLIC_URL + '/img/car3.png'
  return '/img/default.png'

}

export default getCarIconUrl;