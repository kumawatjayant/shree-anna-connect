import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.phone, formData.password);

    if (result.success) {
      toast.success('Admin login successful!');
      navigate('/admin');
    } else {
      setError(result.message);
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, border: '2px solid #2e7d32' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <AdminPanelSettings sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>
          
          <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
            Admin Panel
          </Typography>
          <Typography variant="h6" align="center" gutterBottom color="text.secondary">
            Shree Anna Connect
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Admin Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="Enter admin phone number"
            />

            <TextField
              fullWidth
              label="Admin Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="Enter admin password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Admin access only. Regular users should use the main login.
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;
