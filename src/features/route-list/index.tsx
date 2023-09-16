import { Box, List } from '@mui/material';
import { ComponentType, memo } from 'react';

import { RouteListItem } from './route-list-item';
import { RouteData } from '../../hooks';
import { RouteDto } from '../../models';

import { useAppSelector } from '../../store';

type RouteListProps = {
  data: RouteData;
  onSelect: (routeId: string) => void;
  onSelectItem: (item: RouteDto) => void;
};

export const RouteList: ComponentType<RouteListProps> = memo(({ data, onSelect, onSelectItem }) => {
  const selectedRoute = useAppSelector((state) => state.routes.selectedRoute);

  const selectedItem = useAppSelector((state) => state.routes.selectedRouteItem);
  const list = Object.keys(data);

  return list.length > 0 ? (
    <Box
      sx={{
        overflow: 'hidden',
        overflowY: 'auto',
        height: '100%',
      }}
    >
      <List>
        {list.map((routeId: string) => {
          const item: RouteDto[] = data[routeId];

          return (
            <RouteListItem
              onSelectItem={onSelectItem}
              selectedItem={selectedItem}
              key={`item-route-id-${routeId}`}
              data={item}
              selected={selectedRoute.some((route) => route.routeID === routeId.replace('k', ''))}
              onSelect={() => onSelect(routeId)}
            />
          );
        })}
      </List>
    </Box>
  ) : null;
});
