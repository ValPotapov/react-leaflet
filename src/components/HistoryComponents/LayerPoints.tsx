import { FC } from 'react';

import { Circle, Tooltip } from 'react-leaflet';
import 'leaflet-rotatedmarker';

import { IHistoryPoints } from '../../types/carsTypes';

type TLayerPointsProps = {
  pointItem: IHistoryPoints
}

const LayerPoints: FC<TLayerPointsProps> = ({ pointItem }) => {

  return (
    <div>
      <Circle
        center={[Number(pointItem.lat), Number(pointItem.lng)]}
        pathOptions={{ color: 'blue' }}
        radius={Number(pointItem.radius)}
        fillOpacity={0.2}
        weight={2}
      >
        <Tooltip
          position={[Number(pointItem.lat), Number(pointItem.lng)]}
          pane='historyMapPane-circleTooltip'
          permanent
          // offset={[0, -pointItem.radius]}
          direction='bottom'
          opacity={0.8}
        >{pointItem.name}</Tooltip>
      </Circle>
    </div>
  )
}

export default LayerPoints;
