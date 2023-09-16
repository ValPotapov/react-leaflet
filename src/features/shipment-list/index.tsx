import { ComponentType, memo } from 'react';
import { Box } from '@mui/material';

import { RouteDto } from '../../models';

import { ShipmentItem } from './item';

type ShipmentListProps = {
  data: RouteDto[];
  onSelect?: (route: RouteDto) => void;
};

export const ShipmentList: ComponentType<ShipmentListProps> = memo(
  ({ data = [], onSelect = () => {} }) => {
    return data.length ? (
      <Box
        sx={{
          overflow: 'hidden',
          overflowY: 'auto',
          height: '100%',
        }}
      >
        {data.map((item, index) => {
          return (
            <ShipmentItem
              data={item}
              onSelect={onSelect}
              key={`${index}${item.routeID}${item.latitude}${item.longitude}${item.planID}`}
            />
          );
        })}
      </Box>
    ) : null;
  }
);
