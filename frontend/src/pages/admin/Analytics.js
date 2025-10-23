import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import { Download } from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [regionData, setRegionData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/analytics/region');
      setRegionData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await api.get(`/admin/export/${type}`);
      const dataStr = JSON.stringify(response.data.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_export_${new Date().toISOString()}.json`;
      link.click();
      toast.success(`${type} data exported successfully`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Analytics & Reports
      </Typography>

      {/* Export Buttons */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Export Data
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleExport('users')}
            >
              Export Users
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleExport('crops')}
            >
              Export Crops
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleExport('products')}
            >
              Export Products
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleExport('orders')}
            >
              Export Orders
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Region-wise Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Users by Region
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>State</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Farmers</TableCell>
                    <TableCell align="right">SHGs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">Loading...</TableCell>
                    </TableRow>
                  ) : regionData?.usersByRegion?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No data available</TableCell>
                    </TableRow>
                  ) : (
                    regionData?.usersByRegion?.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row._id?.state || 'N/A'}</TableCell>
                        <TableCell>{row._id?.district || 'N/A'}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                        <TableCell align="right">{row.farmers}</TableCell>
                        <TableCell align="right">{row.shgs}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Crops by Region
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>State</TableCell>
                    <TableCell align="right">Total Crops</TableCell>
                    <TableCell align="right">Total Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">Loading...</TableCell>
                    </TableRow>
                  ) : regionData?.cropsByRegion?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">No data available</TableCell>
                    </TableRow>
                  ) : (
                    regionData?.cropsByRegion?.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row._id || 'N/A'}</TableCell>
                        <TableCell align="right">{row.totalCrops}</TableCell>
                        <TableCell align="right">{row.totalQuantity?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
