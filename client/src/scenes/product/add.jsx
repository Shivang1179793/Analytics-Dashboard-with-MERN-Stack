import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import Header from 'components/Header';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [supply, setSupply] = useState('');
  const [stat, setStat] = useState({ yearlySalesTotal: '', yearlyTotalSoldUnits: '' });
  const navigate = useNavigate();

  const handleAddProduct = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error('No token found in localStorage.');
      return;
    }

    axios.post(`${process.env.REACT_APP_BASE_URL}/products/addProduct`, 
      { name, price, description, supply, stat },
      { headers: { Authorization: `Bearer ${token}` } }  // Include token in Authorization header
    )
      .then(() => {
        navigate('/admin/dashboard'); // Redirect to the main page
      })
      .catch(err => console.error('Error adding product:', err));
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Add New Product" subtitle="Fill in the details below" />
      <Box display="flex" flexDirection="column" maxWidth="500px" mx="auto">
        <TextField
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Supply"
          type="number"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Yearly Sales Total"
          type="number"
          value={stat.yearlySalesTotal}
          onChange={(e) => setStat(prevStat => ({ ...prevStat, yearlySalesTotal: e.target.value }))}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Yearly Units Sold"
          type="number"
          value={stat.yearlyTotalSoldUnits}
          onChange={(e) => setStat(prevStat => ({ ...prevStat, yearlyTotalSoldUnits: e.target.value }))}
          margin="normal"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ mt: 2 }}>
          Add Product
        </Button>
      </Box>
    </Box>
  );
};

export default AddProduct;
