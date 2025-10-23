import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  AppBar,
  Toolbar,
  TextField,
  MenuItem,
  Chip
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import api from '../services/api';
import { toast } from 'react-toastify';

const Marketplace = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products', { params: filters });
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            🌾 Shree Anna Connect - Marketplace
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight={600}>
          Millet Products Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Discover healthy, traceable millet products from local farmers and SHGs
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search Products"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Flour">Flour</MenuItem>
              <MenuItem value="Snacks">Snacks</MenuItem>
              <MenuItem value="Cookies">Cookies</MenuItem>
              <MenuItem value="Ready to Cook">Ready to Cook</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}>
              <Typography align="center">Loading products...</Typography>
            </Grid>
          ) : products.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center">No products found</Typography>
            </Grid>
          ) : (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      {product.name}
                    </Typography>
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Chip label={product.category} size="small" color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      ₹{product.price}/{product.unit}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      By: {product.seller?.organizationName || product.seller?.name}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      ⭐ {product.ratings?.average?.toFixed(1) || 'N/A'} ({product.ratings?.count || 0})
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCart />}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Marketplace;
