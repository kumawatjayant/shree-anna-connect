import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton
} from '@mui/material';
import {
  Agriculture,
  Store,
  ShoppingCart,
  AdminPanelSettings,
  TrendingUp,
  Verified,
  LocalShipping,
  Language
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const features = [
    {
      icon: <Agriculture sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'For Farmers & SHGs',
      description: 'List your crops, get fair prices, and connect directly with buyers'
    },
    {
      icon: <Store sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'For Processors',
      description: 'Source quality millets directly from farmers with full traceability'
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'For Consumers',
      description: 'Buy healthy millet products with farm-to-fork transparency'
    },
    {
      icon: <AdminPanelSettings sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'For Government',
      description: 'Track ecosystem, manage schemes, and support millet adoption'
    }
  ];

  const benefits = [
    { icon: <TrendingUp />, text: '20-30% Income Increase for Farmers' },
    { icon: <Verified />, text: 'Quality Certified & Traceable Products' },
    { icon: <LocalShipping />, text: 'Integrated Logistics Support' },
    { icon: <Language />, text: 'Multilingual & Rural-Friendly' }
  ];

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            🌾 Shree Anna Connect
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1 },
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/marketplace')}
              size="small"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Marketplace
            </Button>
            {user ? (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate(`/${user.role}`)}
                  size="small"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  size="small"
                  sx={{ 
                    ml: { xs: 0.5, sm: 2 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/login')}
                  size="small"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/register')}
                  size="small"
                  sx={{ 
                    ml: { xs: 0.5, sm: 2 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=1600&h=800&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(46, 125, 50, 0.75)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h2" 
            gutterBottom 
            fontWeight={700}
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' }
            }}
          >
            India's First Digital Millet Marketplace
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              opacity: 0.95,
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            Connecting Farmers, SHGs, FPOs, Processors & Consumers for a Healthier, Sustainable Future
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                px: 4, 
                py: 1.5,
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { xs: '300px', sm: 'none' }
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/marketplace')}
              sx={{
                color: 'white',
                borderColor: 'white',
                px: 4,
                py: 1.5,
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { xs: '300px', sm: 'none' },
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Explore Marketplace
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom 
          fontWeight={600}
          sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
        >
          Who We Serve
        </Typography>
        <Typography 
          variant="body1" 
          align="center" 
          color="text.secondary" 
          sx={{ 
            mb: { xs: 3, md: 6 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          A comprehensive platform for all stakeholders in the millet value chain
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            fontWeight={600}
            sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
          >
            Why Choose Shree Anna Connect?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      p: 2,
                      mb: 2
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Typography variant="body1" fontWeight={500}>
                    {benefit.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 4, md: 8 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            fontWeight={600}
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}
          >
            Ready to Join the Millet Revolution?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
            }}
          >
            Whether you're a farmer, FPO, SHG, processor, or consumer - start your journey today
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ px: 5, py: 2 }}
          >
            Register Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1a1a1a', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Shree Anna Connect
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Empowering India's millet ecosystem through digital innovation
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Quick Links
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer' }} onClick={() => navigate('/marketplace')}>
                Marketplace
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', mt: 1 }} onClick={() => navigate('/login')}>
                Login
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, cursor: 'pointer', mt: 1 }} onClick={() => navigate('/register')}>
                Register
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Email: support@shreeanna.in
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                Phone: 1800-XXX-XXXX
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" sx={{ mt: 4, opacity: 0.6 }}>
            © 2024 Shree Anna Connect. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
