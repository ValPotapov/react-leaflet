import { Box, Stack, CircularProgress } from '@mui/material';

interface ISpinnerProps {
  className?: string
  props?: any
}
export const Spinner = (props: ISpinnerProps) => {

  return (
    <Box display="flex" width="100%" height="100vh">
      <Box style={{
        opacity: 0.6,
        width: '100%', height: '100%',
        zIndex: 1000,
        position: 'absolute',
        backgroundColor: '#bbbec0',
      }}>
      </Box>
      <Stack display={'flex'} justifyContent={'center'} alignItems={'center'} margin={'auto'}>

        <CircularProgress color="primary" className={props.className} style={{ zIndex: 1500 }} />
      </Stack>
    </Box>
  )
}