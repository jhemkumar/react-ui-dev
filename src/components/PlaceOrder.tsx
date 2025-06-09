import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';

interface OrderFormData {
  symbol: string;
  quantity: number;
  price: number;
  orderType: 'BUY' | 'SELL';
}

const PlaceOrder: React.FC = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    symbol: '',
    quantity: 0,
    price: 0,
    orderType: 'BUY',
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // TODO: Replace with actual API call
      console.log('Order placed:', formData);
      setSuccess('Order placed successfully!');
      setFormData({ symbol: '', quantity: 0, price: 0, orderType: 'BUY' });
    } catch (err) {
      setError('Failed to place order. Please try again.');
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | 
    (Event & { target: { value: 'BUY' | 'SELL'; name: string } })
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Place Order
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  required
                  fullWidth
                  label="Symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  placeholder="e.g., BTC/USD"
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <FormControl fullWidth required>
                  <InputLabel>Order Type</InputLabel>
                  <Select
                    name="orderType"
                    value={formData.orderType}
                    onChange={handleChange}
                    label="Order Type"
                  >
                    <MenuItem value="BUY">Buy</MenuItem>
                    <MenuItem value="SELL">Sell</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Box>
            </Box>
            <Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Place Order
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PlaceOrder; 