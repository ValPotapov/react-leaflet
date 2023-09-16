import { Box, Typography } from '@mui/material';
import { RouteDto } from '../../models';

import allowedKeys from '../../common/data/popup.json';

export const RouteInfo: React.FC<{ route: RouteDto; type: 'extraPoint' | 'routes' }> = ({
  route,
  type,
}) => {
  if (!route) return null;

  const data = allowedKeys[type] as Array<keyof RouteDto>;

  return (
    <Box>
      {data.map((key) => {
        return (
          <Typography key={`key-${key}`} component={'div'} variant="caption">
            <strong>{key}</strong>: {route[key] ? route[key] : 'Пусто'}
          </Typography>
        );
      })}
    </Box>
  );
};
