const sanitizeCompanyFetch = (data) => {

  const newCompsnyData = data.cars.filter((el) => {
    if (!el.angle) el.angle = '90'
    if (!el.altitude) el.altitude = '0'
    if (!el.speed) el.speed = '0'
    if (!el.last_track) el.last_track = ''
    if (!el.pic) el.pic = ''
    if (!el.car_name) el.car_name = 'noname'
    if (el.lat && el.lng && el.car_id) return el
  })



  return { ...data, cars: newCompsnyData }
}

export default sanitizeCompanyFetch;