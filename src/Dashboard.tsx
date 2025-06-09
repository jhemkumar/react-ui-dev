import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  Collapse,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BookIcon from '@mui/icons-material/Book';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import PlaceOrder from './components/PlaceOrder';
import OrderBook from './components/OrderBook';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [placeOrderOpen, setPlaceOrderOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuClick = (action: string) => {
    handleProfileClose();
    switch (action) {
      case 'profile':
        // TODO: Navigate to profile page
        console.log('Navigate to profile');
        break;
      case 'settings':
        // TODO: Navigate to settings
        console.log('Navigate to settings');
        break;
      case 'help':
        // TODO: Show help dialog
        console.log('Show help');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  const handlePlaceOrderClick = () => {
    setPlaceOrderOpen(!placeOrderOpen);
  };

  const menuItems = [
    {
      text: 'Place Order',
      icon: <ShoppingCartIcon />,
      path: '/dashboard/place-order',
      subItems: [
        { text: 'Loans', icon: <AccountBalanceIcon />, path: '/dashboard/place-order/loans' },
        { text: 'Deposits', icon: <SavingsIcon />, path: '/dashboard/place-order/deposits' },
      ],
    },
    { text: 'Order Book', icon: <BookIcon />, path: '/dashboard/order-book' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h5" noWrap component="div" sx={{ 
              fontWeight: 'bold',
              letterSpacing: '0.1em'
            }}>
              CPOMS
            </Typography>
          </Box>
          <Tooltip title="User Profile">
            <IconButton
              color="inherit"
              onClick={handleProfileClick}
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleProfileClose}
            onClick={handleProfileClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => handleProfileMenuClick('profile')}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleProfileMenuClick('settings')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleProfileMenuClick('help')}>
              <ListItemIcon>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Help</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleProfileMenuClick('logout')}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '64px',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <React.Fragment key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={item.subItems ? handlePlaceOrderClick : () => navigate(item.path)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.subItems && (placeOrderOpen ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </ListItem>
                {item.subItems && (
                  <Collapse in={placeOrderOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.text} disablePadding>
                          <ListItemButton
                            selected={location.pathname === subItem.path}
                            onClick={() => navigate(subItem.path)}
                            sx={{ pl: 4 }}
                          >
                            <ListItemIcon>{subItem.icon}</ListItemIcon>
                            <ListItemText primary={subItem.text} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
        <Routes>
          <Route path="/" element={
            <Paper elevation={3} sx={{ p: 4, minWidth: 300, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Welcome to Dashboard
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Select an option from the menu to get started.
              </Typography>
            </Paper>
          } />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/place-order/loans" element={<PlaceOrder />} />
          <Route path="/place-order/deposits" element={<PlaceOrder />} />
          <Route path="/order-book" element={<OrderBook />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard; 