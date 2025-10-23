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

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchProducts();
  }, [pagination.page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/products', {
        params: { page: pagination.page, limit: 10 }
      });
      setProducts(response.data.data.products);
      setPagination({
        page: response.data.data.currentPage,
        totalPages: response.data.data.totalPages
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Product Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No products found</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.seller?.organizationName || product.seller?.name}
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {product.seller?.region?.district}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    ₹{product.price}/{product.unit}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    ⭐ {product.ratings?.average?.toFixed(1) || 'N/A'} ({product.ratings?.count || 0})
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.status}
                      size="small"
                      color={product.status === 'active' ? 'success' : 'default'}
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

export default ProductManagement;
