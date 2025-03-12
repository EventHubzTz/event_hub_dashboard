import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Stack, Typography } from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import { useNavigate } from 'react-router-dom';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <DrawerHeaderStyled theme={theme} open={open}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center"
          }}
        >
          <Avatar alt='logo' src='/assets/images/logo.jpeg' />
          <Typography variant='h3' sx={{ ml: 2 }}>Pugu Marathon</Typography>
        </Box>
      </Stack>
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default DrawerHeader;
