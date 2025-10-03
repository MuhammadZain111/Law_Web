import * as React from 'react';
import { createTheme, styled } from '@mui/material/styles';
import {
  Avatar,
  Box,
  GlobalStyles,
  Grid,
  IconButton,
  Paper,
  Toolbar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';


import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import Metrics from '../common/Metrics';
import CaseHistory from './CaseHistory';
import TodoList from '../common/TodoList';
import AppointmentList from '../common/AppointmentList';
import Cases from './Cases';
import Profile from './Profile'; 

const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'appointments', title: 'Appointments', icon: <ShoppingCartIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'Analytics' },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      { segment: 'Cases', title: 'Cases', icon: <DescriptionIcon /> },
      { segment: 'traffic', title: 'Traffic', icon: <DescriptionIcon /> },
    ],
  },
  { segment: 'integrations', title: 'Integrations', icon: <LayersIcon /> },
];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);
  return React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    }),
    [pathname],
  );
}

const ROUTE_COMPONENTS = {
  '/dashboard': () => (
    <>
      <Metrics />
      <TodoList />
      <CaseHistory />
    </>
  ),
  '/appointments': () => (
    <div>
      <h2>Appointments</h2>
      <AppointmentList />
    </div>
  ),
  '/reports/Cases': () => (
    <div>
      <h2>Case Reports</h2>
      <Cases />
    </div>
  ),
  '/reports/traffic': () => (
    <div>
      <h2>Traffic Report</h2>
    </div>
  ),
  '/integrations': () => (
    <div>
      <h2>Integrations Page</h2>
    </div>
  ),
};



export default function DashboardLayoutBasic() {
  const router = useDemoRouter('/dashboard');
  const CurrentPage = ROUTE_COMPONENTS[router.pathname] || (() => <div>Page Not Found</div>);

  const [showProfile, setShowProfile] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null); // for hover popover

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <GlobalStyles
        styles={{
          '[class*="ToolpadAppBar"]': { display: 'none !important' },
        }}
      />

      {/* Custom Top Right Avatar + Hover Popover */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 20,
          zIndex: 2000,
        }}
      >
        <IconButton
          onClick={() => setShowProfile(!showProfile)}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <Avatar
            alt="Maria Fernanda"
            src="https://i.imgur.com/WxNkKXl.png"
            sx={{ width: 40, height: 40 }}
          />
        </IconButton>

        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Maria Fernanda
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Premium User
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Beatmaker, Intermediate
            </Typography>
          </Box>
        </Popover>
      </Box>

      <DashboardLayout>
        <PageContainer>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CurrentPage />
            </Grid>
            {showProfile && (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Profile />
                </Paper>
              </Grid>
            )}
          </Grid>
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}