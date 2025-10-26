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
import { ShoppingCart, LocationOn } from '@mui/icons-material';
import api from '../services/api';
import { toast } from 'react-toastify';
import { getCropImage } from '../utils/cropImages';

const CropDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCropDetails();
  }, [id]);

  const fetchCropDetails = async () => {
    try {
      const response = await api.get(`/crops/${id}`);
      setCrop(response.data.data.crop);
    } catch (error) {
      console.error('Error fetching crop:', error);
      toast.error('Failed to load crop details');
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

  if (!crop) {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Back</Button>
        <Typography>Crop not found</Typography>
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
        ← Back
      </Button>
      
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Crop Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={getCropImage(crop)}
              alt={`${crop.cropType} - ${crop.variety}`}
              sx={{
                width: '100%',
                height: { xs: 250, sm: 350, md: 400 },
                objectFit: 'cover',
                borderRadius: 2,
                bgcolor: 'grey.200'
              }}
            />
          </Grid>

          {/* Crop Details */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h4" 
              gutterBottom 
              fontWeight={600}
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
            >
              {crop.cropType}
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              {crop.variety}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={crop.status} 
                color={crop.status === 'available' ? 'success' : 'default'}
              />
              {crop.organic && <Chip label="Organic" color="success" />}
              {crop.certifications && crop.certifications.length > 0 && (
                <Chip label="Certified" color="info" />
              )}
            </Box>

            <Typography variant="h4" color="primary" fontWeight={600} sx={{ mb: 2 }}>
              ₹{crop.expectedPrice}/{crop.quantity?.unit || 'kg'}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Available Quantity: {crop.quantity?.value} {crop.quantity?.unit}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Harvest Date: {new Date(crop.harvestDate).toLocaleDateString()}
            </Typography>

            {crop.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {crop.location.district}, {crop.location.state}
                </Typography>
              </Box>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Farmer: {crop.farmer?.name}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {crop.description || 'High-quality millet crop, organically grown and carefully harvested.'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Crop Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Crop Type:</strong> {crop.cropType}
              </Typography>
              <Typography variant="body2">
                <strong>Variety:</strong> {crop.variety}
              </Typography>
              <Typography variant="body2">
                <strong>Sowing Date:</strong> {crop.sowingDate ? new Date(crop.sowingDate).toLocaleDateString() : 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Harvest Date:</strong> {new Date(crop.harvestDate).toLocaleDateString()}
              </Typography>
              {crop.quality && (
                <Typography variant="body2">
                  <strong>Quality:</strong> {crop.quality}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingCart />}
              sx={{ mt: 2 }}
              disabled={crop.status !== 'available'}
              onClick={() => toast.info('Place order feature coming soon!')}
            >
              {crop.status === 'available' ? 'Place Order' : 'Not Available'}
            </Button>
          </Grid>
        </Grid>

        {/* Additional Information */}
        {crop.certifications && crop.certifications.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Certifications
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {crop.certifications.map((cert, index) => (
                <Chip key={index} label={cert} variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        {/* Location Details */}
        {crop.location && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Typography variant="body2">
              <strong>Village:</strong> {crop.location.village || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>District:</strong> {crop.location.district}
            </Typography>
            <Typography variant="body2">
              <strong>State:</strong> {crop.location.state}
            </Typography>
            <Typography variant="body2">
              <strong>Pincode:</strong> {crop.location.pincode || 'N/A'}
            </Typography>
          </Box>
        )}

        {/* Traceability */}
        {crop.traceabilityEnabled && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Traceability
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This crop has full traceability from farm to market.
        </Typography>
            <Button 
              variant="outlined"
              onClick={() => toast.info('Traceability details coming soon!')}
            >
              View Traceability Chain
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CropDetail;
