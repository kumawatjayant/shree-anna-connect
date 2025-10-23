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
  Button,
  Chip,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Pagination
} from '@mui/material';
import { CheckCircle, Cancel, Visibility, Block, CheckCircleOutline } from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    verificationStatus: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: 10
      };
      const response = await api.get('/admin/users', { params });
      setUsers(response.data.data.users);
      setPagination({
        page: response.data.data.currentPage,
        totalPages: response.data.data.totalPages
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, status) => {
    try {
      await api.put(`/admin/users/${userId}/verify`, {
        verificationStatus: status
      });
      toast.success(`User ${status} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Failed to verify user');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-active`);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        User Management
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Name, phone, email"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Role"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="farmer">Farmer</MenuItem>
              <MenuItem value="fpo">FPO</MenuItem>
              <MenuItem value="shg">SHG</MenuItem>
              <MenuItem value="processor">Processor</MenuItem>
              <MenuItem value="consumer">Consumer</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Verification Status"
              value={filters.verificationStatus}
              onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.value })}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {user.name}
                    </Typography>
                    {user.organizationName && (
                      <Typography variant="caption" color="text.secondary">
                        {user.organizationName}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.toUpperCase()}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {user.region?.district}, {user.region?.state}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.verificationStatus}
                      size="small"
                      color={getStatusColor(user.verificationStatus)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={user.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewDetails(user)}
                      title="View Details"
                    >
                      <Visibility />
                    </IconButton>
                    {user.verificationStatus === 'pending' && (
                      <>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleVerify(user._id, 'verified')}
                          title="Verify"
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleVerify(user._id, 'rejected')}
                          title="Reject"
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      size="small"
                      color={user.isActive ? 'error' : 'success'}
                      onClick={() => handleToggleActive(user._id)}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {user.isActive ? <Block /> : <CheckCircleOutline />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={(e, page) => setPagination({ ...pagination, page })}
          color="primary"
        />
      </Box>

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {selectedUser.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Phone:</strong> {selectedUser.phone}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {selectedUser.email || 'N/A'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Role:</strong> {selectedUser.role}
              </Typography>
              {selectedUser.organizationName && (
                <Typography variant="body1" gutterBottom>
                  <strong>Organization:</strong> {selectedUser.organizationName}
                </Typography>
              )}
              <Typography variant="body1" gutterBottom>
                <strong>Region:</strong> {selectedUser.region?.village}, {selectedUser.region?.district}, {selectedUser.region?.state}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Verification Status:</strong>{' '}
                <Chip
                  label={selectedUser.verificationStatus}
                  size="small"
                  color={getStatusColor(selectedUser.verificationStatus)}
                />
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Account Status:</strong>{' '}
                <Chip
                  label={selectedUser.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={selectedUser.isActive ? 'success' : 'default'}
                />
              </Typography>
              {selectedUser.certifications && selectedUser.certifications.length > 0 && (
                <Typography variant="body1" gutterBottom>
                  <strong>Certifications:</strong> {selectedUser.certifications.join(', ')}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
