import React from 'react';
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
} from '@mui/material';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BookIcon from '@mui/icons-material/Book';
import PlaceOrder from './components/PlaceOrder';
import OrderBook from './components/OrderBook';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { text: 'Place Order', icon: <ShoppingCartIcon />, path: '/dashboard/place-order' },
    { text: 'Order Book', icon: <BookIcon />, path: '/dashboard/order-book' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
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
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
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
          <Route path="/order-book" element={<OrderBook />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard; 