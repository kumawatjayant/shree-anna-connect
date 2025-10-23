import React from 'react';
import { Box, Container, Typography, Paper, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ConsumerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              🌾 Shree Anna Connect - Consumer Dashboard
            </Typography>
            <Box>
              <Button color="inherit" onClick={() => navigate('/marketplace')}>
                Marketplace
              </Button>
              <Button color="inherit" onClick={() => { logout(); navigate('/'); }}>
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>My Orders</Typography>
              <Typography variant="h3" color="primary">0</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/marketplace')}>
                Shop Now
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Wishlist</Typography>
              <Typography variant="h3" color="success.main">0</Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>View Wishlist</Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Total Spent</Typography>
              <Typography variant="h3" color="secondary.main">₹0</Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>View History</Button>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Explore Millet Products</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Discover healthy, traceable millet products from local farmers and SHGs
          </Typography>
          <Button variant="contained" onClick={() => navigate('/marketplace')}>
            Browse Marketplace
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default ConsumerDashboard;
