import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Button, Grid, Card, CardContent, Chip, CircularProgress } from '@mui/material';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import AddCrop from './AddCrop';

const FarmerHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [stats, setStats] = useState({ totalCrops: 0, totalOrders: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crops/my-crops');
      setCrops(response.data.data.crops || []);
      
      // Calculate stats
      const totalCrops = response.data.data.crops?.length || 0;
      setStats({
        totalCrops,
        totalOrders: 0, // TODO: Fetch from orders API
        totalEarnings: 0 // TODO: Calculate from orders
      });
    } catch (error) {
      console.error('Error fetching crops:', error);
      toast.error('Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              🌾 Shree Anna Connect - Farmer Dashboard
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
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>My Crops</Typography>
                  <Typography variant="h3" color="primary">{stats.totalCrops}</Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/farmer/add-crop')}
                  >
                    Add New Crop
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>Orders Received</Typography>
                  <Typography variant="h3" color="success.main">{stats.totalOrders}</Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    onClick={() => toast.info('Orders feature coming soon!')}
                  >
                    View Orders
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>Total Earnings</Typography>
                  <Typography variant="h3" color="secondary.main">₹{stats.totalEarnings}</Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    onClick={() => toast.info('Earnings details coming soon!')}
                  >
                    View Details
                  </Button>
                </Paper>
              </Grid>
            </Grid>

            {/* Crops List */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>My Crop Listings</Typography>
              {crops.length === 0 ? (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  No crops listed yet. Start by adding your first crop!
                </Typography>
              ) : (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {crops.map((crop) => (
                    <Grid item xs={12} md={6} key={crop._id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <Box>
                              <Typography variant="h6">{crop.cropType}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {crop.variety}
                              </Typography>
                              <Typography variant="body1" sx={{ mt: 1 }}>
                                Quantity: {crop.quantity.value} {crop.quantity.unit}
                              </Typography>
                              <Typography variant="body1">
                                Price: ₹{crop.expectedPrice}/{crop.quantity.unit}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Harvest: {new Date(crop.harvestDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Chip 
                              label={crop.status} 
                              color={crop.status === 'available' ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>
                          {crop.certifications && crop.certifications.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              {crop.certifications.map((cert, idx) => (
                                <Chip key={idx} label={cert} size="small" sx={{ mr: 1 }} />
                              ))}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </>
        )}

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item>
              <Button 
                variant="contained"
                onClick={() => navigate('/farmer/add-crop')}
              >
                List New Crop
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined"
                onClick={() => toast.info('Bulk Requests feature coming soon!')}
              >
                View Bulk Requests
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined"
                onClick={() => toast.info('Schemes feature coming soon!')}
              >
                Check Schemes
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {user?.verificationStatus === 'pending' && (
          <Paper sx={{ p: 3, mt: 3, bgcolor: 'warning.light' }}>
            <Typography variant="h6">Account Verification Pending</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Your account is under review. You'll be able to list crops once verified by admin.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

const FarmerDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<FarmerHome />} />
      <Route path="/add-crop" element={<AddCrop />} />
    </Routes>
  );
};

export default FarmerDashboard;
