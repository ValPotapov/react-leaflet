import { useState, useEffect, useMemo, FC } from 'react';
import ReactDOMServer, { render } from 'react-dom';


import { useMap, Tooltip } from 'react-leaflet';
import { Marker as PointMarker } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import L from 'leaflet';

import carsPageconfig from '../MainCars/lib/config';
import isHasToushScreen from '../MainCars/lib/isMobile';

import { IHistoryCar } from '../../types/carsTypes';

type TLayerHistoryMarkersProps = {
  historyFromServer: IHistoryCar
}

const LayersHistoryMarkers: FC<TLayerHistoryMarkersProps> = ({ historyFromServer }) => {
  const isMobile = useMemo(() => isHasToushScreen(), [])// mobile -> true ? PC -> false

  const [iconRadius, setIconRadius] = useState(carsPageconfig.historyMarkerRadius) // defualt 6

  const map = useMap();

  useEffect(() => {

    return () => {
      const menuElement = document.querySelector('[aria-label="Map settings"]')?.closest('.leaflet-control');
      menuElement?.remove()
    }
  }, [map])

  map.on('zoom', function () {
    const carMapZoom = map.getZoom()
    if (carMapZoom > 15) setIconRadius(6)
    if (carMapZoom < 15) setIconRadius(3)
  });

  const createPointIcon = () => {
    return new L.DivIcon({
      className: 'custom-point-icon',
      html: `<svg width="${iconRadius * 4}" height="${iconRadius * 4}"><circle cx="${iconRadius}" cy="${iconRadius}" r="${iconRadius}" fill="red" /></svg>`,
      // iconSize: [8, 8],
      iconAnchor: [iconRadius, iconRadius]

    });
  };


  return (
    <PointMarker
      pane={"historyMapPane"}
      position={[Number(historyFromServer.lat), Number(historyFromServer.lng)]}
      icon={createPointIcon()
      }
    // riseOnHover
    >
      {/* <Tooltip
        pane='historyMapPane'
        eventHandlers={{
          // add: () => onLoadTooltip()

        }}
        // permanent={true}
        direction="top" opacity={1}
      >
        {historyFromServer.timestamp}
      </Tooltip> */}
    </PointMarker>
  )
}

export default LayersHistoryMarkers;
