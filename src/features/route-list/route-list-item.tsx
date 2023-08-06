import {
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { ComponentType, useState } from 'react';

import React from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material/';
import { RouteDto } from '../../models';

type RouteListItemProps = {
  data: RouteDto[];
  selected?: boolean;
  onSelect?: () => void;
};

export const RouteListItem: ComponentType<RouteListItemProps> = ({ data, selected, onSelect }) => {
  const [open, setOpen] = useState<boolean>(false);
  const routeID = data[0].routeID;
  const singlePoint = data.length === 1;
  const isOpen = open || !!selected;

  if (!data) return null;

  return (
    <React.Fragment>
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
          <ListItemText primary={`Rout ID ${routeID}`} />
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Stack
          gap={0.25}
          sx={{
            px: 2,
            py: 1,
          }}
        >
          {data.map((item: RouteDto, index: number) => (
            <React.Fragment key={`key-${item.routeID}-${index}`}>
              <Stack
                direction="row"
                sx={{
                  maxWidth: '100%',
                }}
              >
                <Typography
                  component="div"
                  variant="caption"
                  noWrap={true}
                  sx={{
                    flex: '1 1 auto',
                    maxWidth: '100%',
                    width: 'auto',
                  }}
                >{`${index + 1}. ${item.city}`}</Typography>
                <Typography
                  component="div"
                  variant="caption"
                  sx={{
                    flex: '0 0 auto',
                    marginLeft: 'auto',
                  }}
                >
                  {item.date}
                </Typography>
              </Stack>
            </React.Fragment>
          ))}
        </Stack>
      </Collapse>
    </React.Fragment>
  );
};
