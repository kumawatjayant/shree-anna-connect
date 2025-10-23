import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Back</Button>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Product Details</Typography>
        <Typography>Product ID: {id}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Full product details page - To be implemented
        </Typography>
      </Paper>
    </Container>
  );
};

export default ProductDetail;
