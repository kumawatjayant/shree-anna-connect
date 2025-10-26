import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Groups, 
  Agriculture, 
  TrendingUp, 
  Assignment,
  LocalShipping,
  AccountBalance,
  Inventory
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const FPODashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    memberFarmers: 0,
    totalCrops: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      memberFarmers: 245,
      totalCrops: 1250,
      totalOrders: 89,
      revenue: 458900,
      pendingOrders: 12,
      completedOrders: 77
    });
  }, []);

  const quickActions = [
    { 
      icon: <Agriculture />, 
      label: 'Register Member Crop', 
      action: () => toast.info('Feature coming soon!')
    },
    { 
      icon: <Groups />, 
      label: 'Manage Members', 
      action: () => toast.info('Feature coming soon!')
    },
    { 
      icon: <LocalShipping />, 
      label: 'Bulk Orders', 
      action: () => toast.info('Feature coming soon!')
    },
    { 
      icon: <AccountBalance />, 
      label: 'Financial Reports', 
      action: () => toast.info('Feature coming soon!')
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                <Groups />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  🌾 FPO Dashboard
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {user?.organizationName || user?.name}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                color="inherit" 
                onClick={() => navigate('/marketplace')}
                size="small"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Marketplace
              </Button>
              <Button 
                color="inherit" 
                onClick={() => { logout(); navigate('/'); }}
                size="small"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3 } }}>
        {/* Welcome Section */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Welcome back, {user?.organizationName || user?.name}!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            Managing {stats.memberFarmers} farmers and {stats.totalCrops} crop listings
          </Typography>
        </Paper>

        {/* Key Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Member Farmers
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="primary">
                      {stats.memberFarmers}
                    </Typography>
                  </Box>
                  <Groups color="primary" sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                  ↑ 12% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: '#f3e5f5' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Crops Listed
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="secondary">
                      {stats.totalCrops}
                    </Typography>
                  </Box>
                  <Agriculture color="secondary" sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                  ↑ 8% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Orders
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="success.main">
                      {stats.totalOrders}
                    </Typography>
                  </Box>
                  <Assignment color="success" sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {stats.pendingOrders} pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: '#fff3e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Revenue
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="warning.main">
                      ₹{(stats.revenue / 1000).toFixed(1)}k
                    </Typography>
                  </Box>
                  <TrendingUp color="warning" sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                  ↑ 15% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Quick Actions
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {quickActions.map((action, index) => (
              <Grid item xs={6} sm={6} md={3} key={index}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={action.icon}
                  onClick={action.action}
                  sx={{ 
                    py: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 0.5 }
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    {action.label}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Two Column Layout */}
        <Grid container spacing={3}>
          {/* Recent Orders */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Recent Orders
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {[1, 2, 3].map((order) => (
                <Box 
                  key={order}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    p: 2,
                    mb: 1,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    gap: 1
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Order #{order}234
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pearl Millet - 500 kg
                    </Typography>
                  </Box>
                  <Chip 
                    label="Pending" 
                    color="warning" 
                    size="small"
                  />
                </Box>
              ))}
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Orders
              </Button>
            </Paper>
          </Grid>

          {/* Member Performance */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Member Performance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Active Members</Typography>
                  <Typography variant="body2" fontWeight={600}>85%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Crops Listed</Typography>
                  <Typography variant="body2" fontWeight={600}>92%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={92} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Orders Fulfilled</Typography>
                  <Typography variant="body2" fontWeight={600}>78%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={78} color="success" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Information Banner */}
        {user?.verificationStatus === 'pending' && (
          <Paper sx={{ p: 3, mt: 3, bgcolor: 'warning.light' }}>
            <Typography variant="h6" fontWeight={600}>⚠️ Verification Pending</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Your FPO is under review. You'll be able to access all features once verified by admin.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default FPODashboard;

