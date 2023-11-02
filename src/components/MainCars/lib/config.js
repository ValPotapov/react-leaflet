const carsPageconfig = {
  updateDelay: 1 * 1000, // Время обновления координат
  updatePosMap: 3 * 1000, // Использовалось для обновления карты(положения)
  offsetMapPan: 28, // Сдвиг карты относительно нижний tooltip 
  differentTime: 10 * 60 * 60 * 1000 // 5 часов разница при которой состояние car - disconnect
}

export default carsPageconfig;