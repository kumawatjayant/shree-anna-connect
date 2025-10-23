import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Chip,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';

const SchemeManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentScheme, setCurrentScheme] = useState({
    title: '',
    description: '',
    category: '',
    benefits: '',
    eligibility: { roles: [], regions: [] },
    externalLink: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/schemes');
      setSchemes(response.data.data.schemes);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      toast.error('Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (scheme = null) => {
    if (scheme) {
      setCurrentScheme(scheme);
      setEditMode(true);
    } else {
      setCurrentScheme({
        title: '',
        description: '',
        category: '',
        benefits: '',
        eligibility: { roles: [], regions: [] },
        externalLink: '',
        startDate: '',
        endDate: ''
      });
      setEditMode(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentScheme({
      title: '',
      description: '',
      category: '',
      benefits: '',
      eligibility: { roles: [], regions: [] },
      externalLink: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await api.put(`/admin/schemes/${currentScheme._id}`, currentScheme);
        toast.success('Scheme updated successfully');
      } else {
        await api.post('/admin/schemes', currentScheme);
        toast.success('Scheme created successfully');
      }
      fetchSchemes();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving scheme:', error);
      toast.error('Failed to save scheme');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        await api.delete(`/admin/schemes/${id}`);
        toast.success('Scheme deleted successfully');
        fetchSchemes();
      } catch (error) {
        console.error('Error deleting scheme:', error);
        toast.error('Failed to delete scheme');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Scheme Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Scheme
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Eligible Roles</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Loading...</TableCell>
              </TableRow>
            ) : schemes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No schemes found</TableCell>
              </TableRow>
            ) : (
              schemes.map((scheme) => (
                <TableRow key={scheme._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {scheme.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={scheme.category} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {scheme.eligibility?.roles?.map((role) => (
                      <Chip key={role} label={role} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={scheme.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={scheme.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(scheme)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(scheme._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Scheme' : 'Add New Scheme'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={currentScheme.title}
                onChange={(e) => setCurrentScheme({ ...currentScheme, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={currentScheme.description}
                onChange={(e) => setCurrentScheme({ ...currentScheme, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={currentScheme.category}
                onChange={(e) => setCurrentScheme({ ...currentScheme, category: e.target.value })}
                required
              >
                <MenuItem value="subsidy">Subsidy</MenuItem>
                <MenuItem value="training">Training</MenuItem>
                <MenuItem value="loan">Loan</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="certification">Certification</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Benefits"
                value={currentScheme.benefits}
                onChange={(e) => setCurrentScheme({ ...currentScheme, benefits: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="External Link"
                value={currentScheme.externalLink}
                onChange={(e) => setCurrentScheme({ ...currentScheme, externalLink: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={currentScheme.startDate}
                onChange={(e) => setCurrentScheme({ ...currentScheme, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={currentScheme.endDate}
                onChange={(e) => setCurrentScheme({ ...currentScheme, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchemeManagement;
