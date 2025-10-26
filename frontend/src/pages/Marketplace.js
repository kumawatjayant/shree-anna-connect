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
import { getProductImage } from '../utils/productImages';

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
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            🌾 Shree Anna Connect - Marketplace
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1 },
            flexWrap: 'wrap'
          }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
              size="small"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              size="small"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          fontWeight={600}
          sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
        >
          Millet Products Marketplace
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: { xs: 2, md: 4 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Discover healthy, traceable millet products from local farmers and SHGs
        </Typography>

        {/* Filters */}
        <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2, md: 4 } }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search Products"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              size="small"
              sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              size="small"
              sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
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
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
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
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={getProductImage(product)}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      bgcolor: 'grey.200',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                  <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      {product.name}
                    </Typography>
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="primary" 
                      sx={{ mb: 1, fontSize: { xs: '0.65rem', sm: '0.75rem' } }} 
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      noWrap
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {product.description}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      sx={{ 
                        mt: 2,
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}
                    >
                      ₹{product.price}/{product.unit}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                    >
                      By: {product.seller?.organizationName || product.seller?.name}
                    </Typography>
                    <Box sx={{ mt: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      ⭐ {product.ratings?.average?.toFixed(1) || 'N/A'} ({product.ratings?.count || 0})
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: { xs: 1, sm: 2 } }}>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCart />}
                      onClick={() => navigate(`/product/${product._id}`)}
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
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
