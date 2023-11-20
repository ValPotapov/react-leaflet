import L from 'leaflet';


const findOneMarkerAndOpen = (map: any, shipment: any) => {

  let findMarker: any = {}
  for (let key in map._layers) {
    if (map._layers.hasOwnProperty(key)) {
      if (map._layers[key]?.options.data === `markerKey-${shipment.unicKey}`) {
        findMarker = map._layers[key]
        setTimeout(() => findMarker.openPopup(), 300)
        return true
      }
    }
  }
  return false
}

const findOneClusterAndOpen = (map: any, shipment: any) => {
  let clusters: any = []

  map.eachLayer((l: any) => {
    if (l instanceof L.Marker && map.getBounds().contains(l.getLatLng())) clusters.push(l)
  })
  const findCluster = clusters[0]
  const icon = findCluster?._icon

  if (icon) {
    setTimeout(() => {
      icon.click()
      findOneMarkerAndOpen(map, shipment)
    }, 700)
  }
}

export { findOneMarkerAndOpen, findOneClusterAndOpen }

// markerIcon.setIcon(
//   L.createIcon()
//   new L.DivIcon({
//     html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" /></svg>`,
//     iconSize: [32, 32],
//     iconAnchor: [16, 32],
//     popupAnchor: [0, 0],
//     shadowSize: [32, 32],
//     shadowAnchor: [32, 32],
//   })
// )