import React from 'react';
import { Box, Container, Typography, Paper, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProcessorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              🌾 Shree Anna Connect - Processor Dashboard
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
          Welcome, {user?.organizationName || user?.name}!
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Bulk Requests</Typography>
              <Typography variant="h3" color="primary">0</Typography>
              <Button variant="contained" sx={{ mt: 2 }}>Create Request</Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Orders Placed</Typography>
              <Typography variant="h3" color="success.main">0</Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>View Orders</Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Offers Received</Typography>
              <Typography variant="h3" color="secondary.main">0</Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>View Offers</Button>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item>
              <Button variant="contained">Create Bulk Request</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">Browse Crops</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">View Suppliers</Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProcessorDashboard;
