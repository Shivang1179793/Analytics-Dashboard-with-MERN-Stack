import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddTransaction = () => {
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(''); // State for date
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/transactions`, 
      { name, product, cost, createdAt: date }, {  // Send date as createdAt
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/admin/transactions');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Product"
          fullWidth
          margin="normal"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
        <TextField
          label="Cost"
          fullWidth
          margin="normal"
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <TextField
          label="Transaction Date"
          fullWidth
          margin="normal"
          type="date"  // Input type as date
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Transaction
        </Button>
      </form>
    </Box>
  );
};

export default AddTransaction;
