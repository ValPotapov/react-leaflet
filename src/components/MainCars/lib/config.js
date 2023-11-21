const carsPageconfig = {
  updateDelay: 1 * 1000, // Время обновления координат

  historyMarkerRadius: 3, // Радиус точки маршрута авто на карте история
  historyLineWeight: 3, // Толщина линий маршрута авто на карте история

  isdilution: false, // Делать "Разбавление маркеров маршрута"
  dilutionArrayCount: 2, // На сколько "разбавляем" точки истории авто (например сейчас отобразиться первая, последняя, и каждая четвертая координата)
  dateCompareTime: 60 * 1000, // Разница времени от и до, если меньше то форма disable, сейчас 1 минута

  defaultTimeLocaloffset: 'UTC+3',// Часовой пояс,  по умолчанию Минск
  differentTime: 1, // 5 часов разница при которой состояние car - disconnect

  storeReset: true, // при загрузке карты '/cars' движение авто в реальном времени 
  // будет очищаться store карты грузов и маршрутов, также очищается local.storage
}

export default carsPageconfig;