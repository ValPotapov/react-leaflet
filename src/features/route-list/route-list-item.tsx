import { ComponentType, useState, Fragment, memo } from 'react';
import {
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import { ExpandLess, ExpandMore } from '@mui/icons-material/';
import { RouteDto } from '../../models';

import RouteKeys from '../../common/data/route.json';

type RouteListItemProps = {
  data: RouteDto[];
  selected?: boolean;
  selectedItem: RouteDto | null;
  onSelect: () => void;
  onSelectItem: (item: RouteDto) => void;
};

export const RouteListItem: ComponentType<RouteListItemProps> = memo(
  ({ data, selected, onSelect, onSelectItem, selectedItem }) => {
    const [open, setOpen] = useState<boolean>(false);
    const singlePoint = data.length === 1;
    const isOpen = open || !!selected;

    const headerKeys = RouteKeys.header as Array<keyof RouteDto>;
    const itemKeys = RouteKeys.children as Array<keyof RouteDto>;

    const title = headerKeys.map((key) => data[0][key]).join(', ');

    if (!data) return null;

    return (
      <Fragment>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="expand" onClick={() => setOpen(!open)}>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          }
          disablePadding
        >
          <ListItemButton
            selected={!!selected}
            onClick={() => {
              if (singlePoint) return;
              onSelect?.();
            }}
            disabled={singlePoint}
            dense
          >
            <ListItemText primary={`Route ID ${title}`} />
          </ListItemButton>
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Stack gap={0.25}>
            {data.map((item: RouteDto, index: number) => {
              const isSelected =
                selectedItem?.payload === item.payload &&
                selectedItem?.latitude === item.latitude &&
                selectedItem?.longitude === item.longitude &&
                selectedItem?.freeHours === item.freeHours;

              return (
                // <Fragment key={`key-${item.routeID}-${index}`}>
                <Fragment key={`key-${item.routeID}-${item.unicKey}`}>
                  <Stack
                    className={`shipment__item ${isSelected ? 'shipment__isSelected' : ''}`}
                    onClick={() => onSelectItem(item)}
                    direction="row"
                    sx={{
                      px: 2,
                      py: 0.5,
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <Typography variant="caption" noWrap={true}>
                        {index + 1}. {item[itemKeys[0]]}
                      </Typography>
                    </div>
                    <div>
                      {itemKeys.map((key, index2) => {
                        if (index2 === 0) {
                          return null;
                        }

                        return (
                          <Typography key={index2} variant="caption" noWrap={true}>
                            {item[key] + ' '}
                          </Typography>
                        );
                      })}
                    </div>
                  </Stack>
                </Fragment>
              );
            })}
          </Stack>
        </Collapse>
      </Fragment>
    );
  }
);
