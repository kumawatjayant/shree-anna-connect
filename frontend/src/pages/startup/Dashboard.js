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
  Avatar,
  Divider,
  LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Rocket,
  TrendingUp,
  ShoppingCart,
  Inventory,
  People,
  Analytics,
  AccountBalance,
  LocalShipping
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const StartupDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    productsListed: 0,
    totalOrders: 0,
    revenue: 0,
    customers: 0,
    growthRate: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      productsListed: 42,
      totalOrders: 287,
      revenue: 856700,
      customers: 134,
      growthRate: 45,
      pendingOrders: 18
    });
  }, []);

  const quickActions = [
    { 
      icon: <Inventory />, 
      label: 'Add Product', 
      color: 'primary',
      action: () => toast.info('Feature coming soon!')
    },
    { 
      icon: <LocalShipping />, 
      label: 'Manage Orders', 
      color: 'success',
      action: () => toast.info('Feature coming soon!')
    },
    { 
      icon: <Analytics />, 
      label: 'View Analytics', 
      color: 'info',
      action: () => toast.info('Feature coming soon!')
    },
    { 
      icon: <People />, 
      label: 'Customer Insights', 
      color: 'secondary',
      action: () => toast.info('Feature coming soon!')
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white', 
          py: 2, 
          px: 3 
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                <Rocket />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  🚀 Startup Dashboard
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
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Welcome back, {user?.organizationName || user?.name}! 🚀
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            Your startup is growing at {stats.growthRate}% month-over-month
          </Typography>
        </Paper>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                      Total Revenue
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      ₹{(stats.revenue / 100000).toFixed(1)}L
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  ↑ 45% from last month
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
                  <ShoppingCart color="success" sx={{ fontSize: 40, opacity: 0.7 }} />
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
                      Products Listed
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="warning.main">
                      {stats.productsListed}
                    </Typography>
                  </Box>
                  <Inventory color="warning" sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                  ↑ 8 new this month
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
                      Total Customers
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="secondary">
                      {stats.customers}
                    </Typography>
                  </Box>
                  <People color="secondary" sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                  ↑ 23 new this month
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
                  variant="contained"
                  fullWidth
                  color={action.color}
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

        {/* Business Insights */}
        <Grid container spacing={3}>
          {/* Growth Metrics */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Growth Metrics
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Revenue Growth</Typography>
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    +45%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={45} 
                  color="success"
                  sx={{ height: 10, borderRadius: 5 }} 
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Customer Acquisition</Typography>
                  <Typography variant="body2" fontWeight={600} color="info.main">
                    +38%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={38} 
                  color="info"
                  sx={{ height: 10, borderRadius: 5 }} 
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Product Expansion</Typography>
                  <Typography variant="body2" fontWeight={600} color="warning.main">
                    +25%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={25} 
                  color="warning"
                  sx={{ height: 10, borderRadius: 5 }} 
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Market Reach</Typography>
                  <Typography variant="body2" fontWeight={600} color="secondary.main">
                    +52%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={52} 
                  color="secondary"
                  sx={{ height: 10, borderRadius: 5 }} 
                />
              </Box>
            </Paper>
          </Grid>

          {/* Top Categories */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Top Categories
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {[
                { category: 'Flour', percentage: 35 },
                { category: 'Snacks', percentage: 28 },
                { category: 'Cookies', percentage: 22 },
                { category: 'Ready to Cook', percentage: 15 }
              ].map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{item.category}</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {item.percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.percentage}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* Funding & Support */}
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}
            >
              <AccountBalance sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Funding Opportunities
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                Explore government schemes and investor connections for millet startups
              </Typography>
              <Button variant="contained" color="warning">
                Explore Now
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white'
              }}
            >
              <Rocket sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Scale Your Business
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                Get mentorship, training, and resources to grow your millet startup
              </Typography>
              <Button variant="contained" color="secondary">
                Learn More
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Information Banner */}
        {user?.verificationStatus === 'pending' && (
          <Paper sx={{ p: 3, mt: 3, bgcolor: 'warning.light' }}>
            <Typography variant="h6" fontWeight={600}>⚠️ Verification Pending</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Your startup is under review. You'll be able to access all features once verified by admin.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default StartupDashboard;

