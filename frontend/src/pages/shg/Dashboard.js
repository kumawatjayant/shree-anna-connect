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
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Diversity3,
  ShoppingBag,
  TrendingUp,
  Inventory,
  LocalShipping,
  AccountBalance,
  People
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const SHGDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    groupMembers: 0,
    productsListed: 0,
    totalSales: 0,
    revenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      groupMembers: 15,
      productsListed: 24,
      totalSales: 156,
      revenue: 125400,
      pendingOrders: 8,
      completedOrders: 148
    });
  }, []);

  const quickActions = [
    { 
      icon: <ShoppingBag />, 
      label: 'Add New Product', 
      action: () => toast.info('Feature coming soon!')
    },
    { 
      icon: <People />, 
      label: 'Manage Members', 
      action: () => toast.info('Feature coming soon!')
    },
    { 
      icon: <LocalShipping />, 
      label: 'View Orders', 
      action: () => navigate('/marketplace')
    },
    { 
      icon: <AccountBalance />, 
      label: 'Financial Summary', 
      action: () => toast.info('Feature coming soon!')
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 2, px: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <Diversity3 />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  🌾 SHG Dashboard
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
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Welcome, {user?.organizationName || user?.name}!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            Empowering {stats.groupMembers} women with {stats.productsListed} millet products
          </Typography>
        </Paper>

        {/* Key Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: '#fce4ec' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Group Members
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="secondary">
                      {stats.groupMembers}
                    </Typography>
                  </Box>
                  <People color="secondary" sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  All active members
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
                  ↑ 6 new this month
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
                      Total Sales
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="success.main">
                      {stats.totalSales}
                    </Typography>
                  </Box>
                  <ShoppingBag color="success" sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {stats.pendingOrders} pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Revenue
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="primary">
                      ₹{(stats.revenue / 1000).toFixed(1)}k
                    </Typography>
                  </Box>
                  <TrendingUp color="primary" sx={{ fontSize: 40, opacity: 0.7 }} />
                </Box>
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                  ↑ 18% from last month
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
          {/* Top Products */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Top Selling Products
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {[
                { name: 'Ragi Cookies', sales: 45, revenue: 12500 },
                { name: 'Jowar Flour', sales: 38, revenue: 9800 },
                { name: 'Bajra Snacks', sales: 32, revenue: 8600 }
              ].map((product, index) => (
                <Box 
                  key={index}
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
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.sales} units sold
                    </Typography>
                  </Box>
                  <Chip 
                    label={`₹${product.revenue}`} 
                    color="success" 
                    size="small"
                  />
                </Box>
              ))}
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                View All Products
              </Button>
            </Paper>
          </Grid>

          {/* Member Activities */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Recent Activities
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                {[
                  { activity: 'New product added', time: '2 hours ago' },
                  { activity: 'Order fulfilled', time: '5 hours ago' },
                  { activity: 'Payment received', time: '1 day ago' },
                  { activity: 'Member training', time: '2 days ago' }
                ].map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {item.activity}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {item.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Government Schemes */}
        <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.light' }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            💡 Available Government Schemes
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Your SHG may be eligible for various government support schemes
          </Typography>
          <Button variant="contained" color="info">
            Explore Schemes
          </Button>
        </Paper>

        {/* Information Banner */}
        {user?.verificationStatus === 'pending' && (
          <Paper sx={{ p: 3, mt: 3, bgcolor: 'warning.light' }}>
            <Typography variant="h6" fontWeight={600}>⚠️ Verification Pending</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Your SHG is under review. You'll be able to access all features once verified by admin.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default SHGDashboard;

