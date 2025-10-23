import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

const milletTypes = [
  'Foxtail Millet',
  'Pearl Millet',
  'Finger Millet',
  'Little Millet',
  'Kodo Millet',
  'Proso Millet',
  'Barnyard Millet',
  'Sorghum',
  'Red Gram',
  'Green Gram',
  'Black Gram',
  'Bengal Gram',
  'Other'
];

const certifications = [
  { value: 'organic', label: 'Organic' },
  { value: 'pesticide_free', label: 'Pesticide Free' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'certified_seed', label: 'Certified Seed' }
];

const qualityGrades = ['A', 'B', 'C'];
const units = ['kg', 'quintal', 'ton'];
const soilTypes = ['Red Soil', 'Black Soil', 'Alluvial', 'Clay', 'Sandy', 'Loamy'];
const irrigationTypes = ['Rainfed', 'Drip', 'Sprinkler', 'Flood', 'Other'];

const AddCrop = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropType: '',
    variety: '',
    quantity: {
      value: '',
      unit: 'kg'
    },
    expectedPrice: '',
    harvestDate: '',
    qualityGrade: 'B',
    certifications: [],
    description: '',
    farmDetails: {
      farmSize: '',
      soilType: '',
      irrigationType: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCertificationChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      certifications: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.cropType || !formData.variety || !formData.quantity.value || !formData.expectedPrice || !formData.harvestDate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/crops', formData);
      
      if (response.data.success) {
        toast.success('Crop listed successfully!');
        navigate('/farmer');
      }
    } catch (error) {
      console.error('Error adding crop:', error);
      toast.error(error.response?.data?.message || 'Failed to add crop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight={600}>
            🌾 Add New Crop Listing
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            List Your Crop
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details below to list your crop for sale
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Crop Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Crop Type</InputLabel>
                  <Select
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleChange}
                    label="Crop Type"
                  >
                    {milletTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Variety */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Variety"
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  placeholder="e.g., Local Variety, HMT-100-1"
                />
              </Grid>

              {/* Quantity */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Quantity"
                  name="quantity.value"
                  type="number"
                  value={formData.quantity.value}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* Unit */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="quantity.unit"
                    value={formData.quantity.unit}
                    onChange={handleChange}
                    label="Unit"
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Expected Price */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Expected Price per Unit (₹)"
                  name="expectedPrice"
                  type="number"
                  value={formData.expectedPrice}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              {/* Harvest Date */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Harvest Date"
                  name="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Quality Grade */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Quality Grade</InputLabel>
                  <Select
                    name="qualityGrade"
                    value={formData.qualityGrade}
                    onChange={handleChange}
                    label="Quality Grade"
                  >
                    {qualityGrades.map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        Grade {grade}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Certifications */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Certifications</InputLabel>
                  <Select
                    multiple
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleCertificationChange}
                    input={<OutlinedInput label="Certifications" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={certifications.find(c => c.value === value)?.label || value}
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {certifications.map((cert) => (
                      <MenuItem key={cert.value} value={cert.value}>
                        {cert.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Select all that apply</FormHelperText>
                </FormControl>
              </Grid>

              {/* Farm Size */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Farm Size (acres)"
                  name="farmDetails.farmSize"
                  type="number"
                  value={formData.farmDetails.farmSize}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>

              {/* Soil Type */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Soil Type</InputLabel>
                  <Select
                    name="farmDetails.soilType"
                    value={formData.farmDetails.soilType}
                    onChange={handleChange}
                    label="Soil Type"
                  >
                    {soilTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Irrigation Type */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Irrigation Type</InputLabel>
                  <Select
                    name="farmDetails.irrigationType"
                    value={formData.farmDetails.irrigationType}
                    onChange={handleChange}
                    label="Irrigation Type"
                  >
                    {irrigationTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide additional details about your crop..."
                  inputProps={{ maxLength: 1000 }}
                  helperText={`${formData.description.length}/1000 characters`}
                />
              </Grid>

              {/* Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/farmer')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? 'Listing...' : 'List Crop'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddCrop;
