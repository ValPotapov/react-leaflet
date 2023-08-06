import { Box, BoxProps, List } from '@mui/material';
import { ComponentType } from 'react';

import { RouteListItem } from './route-list-item';
import { RouteData } from '../../hooks';
import { RouteDto } from '../../models';

type RouteListProps = Omit<BoxProps, 'onSelect'> & {
  data: RouteData;
  selectedId?: string | null;
  onSelect: (routeId: string) => void;
};

export const RouteList: ComponentType<RouteListProps> = ({
  data,
  onSelect,
  selectedId,
  ...props
}) => {
  const list = Object.keys(data);

  return list.length > 0 ? (
    <Box
      sx={{
        ...props.sx,
        overflow: 'hidden',
        overflowY: 'auto',
      }}
    >
      <List>
        {list?.map((routeId: string) => {
          const item: RouteDto[] = data[routeId];
          return (
            <RouteListItem
              key={`item-route-id-${routeId}`}
              data={item}
              selected={routeId === selectedId}
              onSelect={() => onSelect(routeId)}
            />
          );
        })}
      </List>
    </Box>
  ) : null;
};
