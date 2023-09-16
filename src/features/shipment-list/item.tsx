import { FC, memo, useMemo } from 'react';

import { ListItem, ListItemText, Typography } from '@mui/material';
import { RouteDto } from '../../models';

import { useAppSelector } from '../../store';

import keys from '../../common/data/extraPoint.json';

type TypeShipmentItem = {
  data: RouteDto;
  onSelect?: (route: RouteDto) => void;
};

const ShipmentItem: FC<TypeShipmentItem> = memo(({ data, onSelect = () => {} }) => {
  const selectedExtraPoint = useAppSelector((state) => state.routes.selectedExtraPoint);

  const isSelected = useMemo(
    () =>
      selectedExtraPoint?.payload === data.payload &&
      selectedExtraPoint?.latitude === data.latitude &&
      selectedExtraPoint?.longitude === data.longitude &&
      selectedExtraPoint?.planID === data.planID,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedExtraPoint, data]
  );

  const itemKeys = keys as Array<keyof RouteDto>;

  return (
    <ListItem
      id={`${data.payload}${data.latitude}${data.longitude}`}
      className={`shipment__item ${isSelected ? 'shipment__isSelected' : ''}`}
      disablePadding
      sx={{ px: 2, py: 0 }}
      onClick={() => onSelect(data)}
    >
      <ListItemText
        primary={
          <Typography variant="caption">{itemKeys.map((key) => data[key]).join(' ')}</Typography>
        }
      />
    </ListItem>
  );
});

export { ShipmentItem };
