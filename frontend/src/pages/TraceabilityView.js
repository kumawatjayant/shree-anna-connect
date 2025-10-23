import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const TraceabilityView = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Back</Button>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Product Traceability</Typography>
        <Typography>Batch ID: {batchId}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Farm-to-fork traceability information - To be implemented
        </Typography>
      </Paper>
    </Container>
  );
};

export default TraceabilityView;
