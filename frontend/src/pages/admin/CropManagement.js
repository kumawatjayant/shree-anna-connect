import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination
} from '@mui/material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const CropManagement = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchCrops();
  }, [pagination.page]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/crops', {
        params: { page: pagination.page, limit: 10 }
      });
      setCrops(response.data.data.crops);
      setPagination({
        page: response.data.data.currentPage,
        totalPages: response.data.data.totalPages
      });
    } catch (error) {
      console.error('Error fetching crops:', error);
      toast.error('Failed to load crops');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Crop Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Crop Type</TableCell>
              <TableCell>Variety</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Harvest Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : crops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No crops found</TableCell>
              </TableRow>
            ) : (
              crops.map((crop) => (
                <TableRow key={crop._id}>
                  <TableCell>{crop.cropType}</TableCell>
                  <TableCell>{crop.variety}</TableCell>
                  <TableCell>
                    {crop.seller?.name}
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {crop.seller?.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {crop.quantity.value} {crop.quantity.unit}
                  </TableCell>
                  <TableCell>₹{crop.expectedPrice}</TableCell>
                  <TableCell>{format(new Date(crop.harvestDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Chip
                      label={crop.status}
                      size="small"
                      color={crop.status === 'available' ? 'success' : 'default'}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={(e, page) => setPagination({ ...pagination, page })}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default CropManagement;
