import { Box, Typography } from '@mui/material';
import { RouteDto } from '../../models';

export const RouteInfo: React.FC<{ route: RouteDto }> = ({ route }) => {
  if (!route) return null;

  return (
    <Box>
      {Object.entries(route).map(([key, value]) => {
        return (
          <Typography key={`key-${key}`} component={'div'} variant="caption">
            <strong>{key}</strong>: {value}
          </Typography>
        );
      })}
    </Box>
  );
};
