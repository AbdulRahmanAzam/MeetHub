import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to MeetHub
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          The Ultimate Society Management and Scheduling Platform
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
          Manage your university society's structure, schedule meetings, book rooms,
          and keep everyone connected with announcements and polls.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>

        <Box sx={{ mt: 8, width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Key Features
          </Typography>
          <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📊 Hierarchical Structure
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organize your society with departments, sub-departments, and modules
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📅 Smart Scheduling
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered meeting time suggestions based on member availability
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                🏢 Room Booking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage room reservations with conflict detection
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                🔔 Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time updates for meetings, announcements, and more
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                👥 Role Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                President, EXCOM, Extended members with specific permissions
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📢 Communication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Announcements, polls, and member availability tracking
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
