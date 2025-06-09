import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';

interface Order {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  timestamp: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const OrderBook: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockOrders: Order[] = [
      {
        id: '1',
        symbol: 'BTC/USD',
        type: 'BUY',
        quantity: 1.5,
        price: 50000,
        status: 'COMPLETED',
        timestamp: '2024-03-20 10:30:00',
      },
      {
        id: '2',
        symbol: 'ETH/USD',
        type: 'SELL',
        quantity: 5,
        price: 3000,
        status: 'PENDING',
        timestamp: '2024-03-20 11:15:00',
      },
      // Add more mock orders as needed
    ];
    setOrders(mockOrders);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (tabValue === 0) return true; // All orders
    if (tabValue === 1) return order.type === 'BUY'; // Loans
    if (tabValue === 2) return order.type === 'SELL'; // Deposits
    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="order tabs">
            <Tab label="All Orders" />
            <Tab label="Loans" />
            <Tab label="Deposits" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <OrderTable 
            orders={filteredOrders}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            getStatusColor={getStatusColor}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <OrderTable 
            orders={filteredOrders}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            getStatusColor={getStatusColor}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <OrderTable 
            orders={filteredOrders}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            getStatusColor={getStatusColor}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
};

interface OrderTableProps {
  orders: Order[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getStatusColor: (status: Order['status']) => "success" | "warning" | "error" | "default";
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  getStatusColor,
}) => {
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.symbol}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell align="right">{order.quantity}</TableCell>
                  <TableCell align="right">${order.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.timestamp}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
};

export default OrderBook; 