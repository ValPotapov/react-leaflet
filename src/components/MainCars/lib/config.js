const carsPageconfig = {
  updateDelay: 1 * 1000, // Время обновления координат
  differentTime: 5, // 5 часов разница при которой состояние car - disconnect
  dateCompareTime: 60 * 1000, // Разница времени от и до, если меньше то форма disable, сейчас 1 минута
  historyMarkerRadius: 3, // Радиус точки маршрута авто на карте история
  historyLineWeight: 3, // Толщина линий маршрута авто на карте история
  isdilution: true, // Делать "Разбавление маркеров маршрута"
  dilutionArrayCount: 2, // На сколько "разбавляем" точки истории авто (например сейчас отобразиться первая, последняя, и каждая четвертая координата)
  defaultTimeLocaloffset: '180'// Смещение часового пояса в миинутах подефолту Минск (GMT+3 = 180)
}

export default carsPageconfig;