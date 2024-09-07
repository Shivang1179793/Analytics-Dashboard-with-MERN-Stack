import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardActions, CardContent, Collapse, Button, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Header from "components/Header";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const [isExpanded, setIsExpanded] = useState(null);
  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.get(`${process.env.REACT_APP_BASE_URL}/products/getProducts`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setProducts(res.data))
        .catch(err => console.error('Error fetching products:', err));
    }
  }, [token]);

  const deleteProduct = (productName) => {
    axios.post(`${process.env.REACT_APP_BASE_URL}/products/deleteProduct`, { name: productName }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setProducts(products.filter(p => p.name !== productName)))
      .catch(err => console.error('Error deleting product:', err));
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUCTS" subtitle="See your list of products." />
      <Button variant="contained" color="primary" onClick={() => navigate('/add-product')}>
        Add Product
      </Button>
      <Box mt="20px" display="grid" gridTemplateColumns="repeat(4, minmax(0, 1fr))" justifyContent="space-between" rowGap="20px" columnGap="1.33%" sx={{
        "&>div": { gridColumn: isNonMobile ? undefined : "span 4" }
      }}>
        {products.map(product => (
          <Card key={product._id} sx={{
            backgroundImage: "none",
            backgroundColor: theme.palette.background.alt,
            borderRadius: "0.55rem"
          }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color={theme.palette.secondary[700]} gutterBottom>
                Product Name
              </Typography>
              <Typography variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
                ${Number(product.price).toFixed(2)}
              </Typography>
              <Typography variant="body2">{product.description}</Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" size="small" onClick={() => setIsExpanded(isExpanded === product._id ? null : product._id)}>
                See More
              </Button>
              <Button variant="outlined" size="small" onClick={() => deleteProduct(product.name)}>
                Delete
              </Button>
            </CardActions>
            <Collapse in={isExpanded === product._id} timeout="auto" unmountOnExit sx={{
              color: theme.palette.neutral[300]
            }}>
              <CardContent>
                <Typography>Supply Left: {product.supply}</Typography>
                <Typography>Yearly Sales This Year: {product.stat.yearlySalesTotal}</Typography>
                <Typography>Yearly Units Sold This Year: {product.stat.yearlyTotalSoldUnits}</Typography>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Index;
