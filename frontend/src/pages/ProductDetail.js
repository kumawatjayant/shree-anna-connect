import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, Star } from '@mui/icons-material';
import api from '../services/api';
import { toast } from 'react-toastify';
import { getProductImage } from '../utils/productImages';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Back</Button>
        <Typography>Product not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
      <Button 
        onClick={() => navigate(-1)} 
        sx={{ 
          mb: 2,
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}
      >
        ← Back to Marketplace
      </Button>
      
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={getProductImage(product)}
              alt={product.name}
              sx={{
                width: '100%',
                height: { xs: 250, sm: 350, md: 400 },
                objectFit: 'cover',
                borderRadius: 2,
                bgcolor: 'grey.200'
              }}
            />
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h4" 
              gutterBottom 
              fontWeight={600}
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
            >
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={product.category} 
                color="primary"
                size="small"
              />
              {product.organic && <Chip label="Organic" color="success" size="small" />}
              {product.certifications && product.certifications.length > 0 && (
                <Chip label="Certified" color="info" size="small" />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Star sx={{ color: 'gold', fontSize: { xs: 20, md: 24 } }} />
              <Typography 
                variant="h6"
                sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                {product.ratings?.average?.toFixed(1) || 'N/A'}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                ({product.ratings?.count || 0} reviews)
              </Typography>
            </Box>

            <Typography 
              variant="h4" 
              color="primary" 
              fontWeight={600} 
              sx={{ 
                mb: 2,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              ₹{product.price}/{product.unit}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Available Quantity: {product.quantityAvailable} {product.unit}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sold by: {product.seller?.organizationName || product.seller?.name}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Category:</strong> {product.category}
              </Typography>
              <Typography variant="body2">
                <strong>Unit:</strong> {product.unit}
              </Typography>
              {product.shelfLife && (
                <Typography variant="body2">
                  <strong>Shelf Life:</strong> {product.shelfLife}
                </Typography>
              )}
              {product.nutritionalInfo && (
                <Typography variant="body2">
                  <strong>Nutritional Info:</strong> Available
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingCart />}
              sx={{ mt: 2 }}
              disabled={product.quantityAvailable === 0}
            >
              {product.quantityAvailable === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </Grid>
        </Grid>

        {/* Additional Information */}
        {product.certifications && product.certifications.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Certifications
        </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {product.certifications.map((cert, index) => (
                <Chip key={index} label={cert} variant="outlined" />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProductDetail;
