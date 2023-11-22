import L from 'leaflet';

function zoomOutHandler(map: L.Map) {
  const observer = new MutationObserver((mutations, obs) => {
    const target = map.getContainer().querySelector('[data-control="zoomOut"]') as HTMLElement; // Приведение типа
    map.whenReady(() => {

      if (target) {
        setTimeout(() => {
          target.click();
        }, 300)
        console.log("Zoom Out button found and clicked");
        obs.disconnect();
      }

    })
  })

  observer.observe(map.getContainer(), {
    childList: true,
    subtree: true
  });
  return () => observer.disconnect();
}

export default zoomOutHandler