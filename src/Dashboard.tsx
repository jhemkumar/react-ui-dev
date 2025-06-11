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
  Card,
  CardContent,
  CardActions,
  Modal,
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PlaceOrder from './components/PlaceOrder';
import OrderBook from './components/OrderBook';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [placeOrderOpen, setPlaceOrderOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const open = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

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

  const handlePlaceOrderClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling
    setPlaceOrderOpen(!placeOrderOpen);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    // Collapse drawer for both OrderBook and Place Order views
    if (path === '/dashboard/order-book' || path.startsWith('/dashboard/place-order')) {
      setDrawerOpen(false);
    }
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
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(drawerOpen && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
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
          width: drawerOpen ? drawerWidth : 0,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : 0,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            marginTop: '64px',
            borderRight: drawerOpen ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
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
                    onClick={() => {
                      if (item.subItems) {
                        handleMenuItemClick(item.path);
                        setDrawerOpen(false); // Collapse drawer when clicking Place Order
                      } else {
                        handleMenuItemClick(item.path);
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.subItems && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaceOrderClick(e);
                        }}
                        sx={{ p: 0 }}
                      >
                        {placeOrderOpen ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </ListItemButton>
                </ListItem>
                {item.subItems && (
                  <Collapse in={placeOrderOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.text} disablePadding>
                          <ListItemButton
                            selected={location.pathname === subItem.path}
                            onClick={() => {
                              handleMenuItemClick(subItem.path);
                              setDrawerOpen(false); // Collapse drawer when clicking sub-items
                            }}
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
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          marginTop: '64px',
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(drawerOpen && {
            marginLeft: drawerWidth,
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
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
          <Route path="/place-order" element={<FinancialProducts />} />
          <Route path="/place-order/loans" element={<PlaceOrder />} />
          <Route path="/place-order/deposits" element={<PlaceOrder />} />
          <Route path="/place-order/mortgage" element={<PlaceOrder />} />
          <Route path="/place-order/bonds" element={<PlaceOrder />} />
          <Route path="/place-order/funds" element={<PlaceOrder />} />
          <Route path="/place-order/equities" element={<PlaceOrder />} />
          <Route path="/place-order/eto" element={<PlaceOrder />} />
          <Route path="/order-book" element={
            <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Order Book</Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    navigate('/dashboard');
                    setDrawerOpen(true);
                  }}
                  startIcon={<ArrowBackIcon />}
                >
                  Back to Dashboard
                </Button>
              </Box>
              <Box sx={{ flexGrow: 1, position: 'relative', bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                <OrderBook />
              </Box>
            </Box>
          } />
        </Routes>
      </Box>
    </Box>
  );
};

const FinancialProducts: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  const products = [
    {
      title: 'Loans',
      description: 'Access various loan products with competitive interest rates',
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/place-order/loans',
      color: '#1976d2',
      isIframe: false
    },
    {
      title: 'Deposits',
      description: 'Secure your savings with our deposit products',
      icon: <SavingsIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/place-order/deposits',
      color: '#2e7d32',
      isIframe: false
    },
    {
      title: 'Mortgage Loan',
      description: 'Realize your dream of homeownership with our mortgage solutions',
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/place-order/mortgage',
      color: '#ed6c02',
      isIframe: false
    },
    {
      title: 'Bonds',
      description: 'Invest in government and corporate bonds',
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/place-order/bonds',
      color: '#9c27b0',
      isIframe: false
    },
    {
      title: 'Funds',
      description: 'Diversify your portfolio with our investment funds',
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/place-order/funds',
      color: '#d32f2f',
      isIframe: false
    },
    {
      title: 'Equities',
      description: 'Trade stocks and shares in global markets',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/place-order/equities',
      color: '#0288d1',
      isIframe: false
    },
    {
      title: 'ETO',
      description: 'Exchange Traded Options for advanced trading strategies',
      icon: <ShowChartIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/place-order/eto',
      color: '#7b1fa2',
      isIframe: false
    },
    {
      title: 'IPO Bonds',
      description: 'Access Initial Public Offering bonds and market data',
      icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
      path: 'ipo-bonds',
      color: '#00695c',
      isIframe: true
    }
  ];

  const handleCardClick = (product: typeof products[0]) => {
    if (product.isIframe) {
      setSelectedProduct(product.path);
    } else {
      navigate(product.path);
      setSelectedProduct(null);
    }
  };

  if (selectedProduct === 'ipo-bonds') {
    return (
      <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">IPO Bonds Market Data</Typography>
          <Button 
            variant="outlined" 
            onClick={() => setSelectedProduct(null)}
            startIcon={<ArrowBackIcon />}
          >
            Back to Products
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <iframe
            src="https://www.nseindia.com/market-data/ipo"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            title="IPO Bonds"
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, mt: 2 }}>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 3
      }}>
        {products.map((product) => (
          <Box key={product.title}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleCardClick(product)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2,
                  color: product.color
                }}>
                  {product.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  size="small" 
                  variant="contained"
                  sx={{ 
                    backgroundColor: product.color,
                    '&:hover': {
                      backgroundColor: product.color,
                      opacity: 0.9
                    }
                  }}
                >
                  {product.isIframe ? 'View Live' : 'Learn More'}
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard; 