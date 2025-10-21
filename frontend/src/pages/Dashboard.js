import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button
} from '@mui/material';
import {
  CalendarMonth,
  Groups,
  Announcement,
  Poll,
  MeetingRoom
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Meetings',
      description: 'Schedule and manage meetings',
      icon: <CalendarMonth sx={{ fontSize: 60 }} />,
      path: '/meetings',
      color: '#1976d2'
    },
    {
      title: 'Departments',
      description: 'View department hierarchy',
      icon: <Groups sx={{ fontSize: 60 }} />,
      path: '/departments',
      color: '#2e7d32'
    },
    {
      title: 'Announcements',
      description: 'View society announcements',
      icon: <Announcement sx={{ fontSize: 60 }} />,
      path: '/announcements',
      color: '#ed6c02'
    },
    {
      title: 'Polls',
      description: 'Participate in polls',
      icon: <Poll sx={{ fontSize: 60 }} />,
      path: '/polls',
      color: '#9c27b0'
    },
    {
      title: 'Rooms',
      description: 'View room availability',
      icon: <MeetingRoom sx={{ fontSize: 60 }} />,
      path: '/rooms',
      color: '#d32f2f'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Role: {user?.role?.toUpperCase()}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate(feature.path)}
            >
              <Box sx={{ color: feature.color, mb: 2 }}>
                {feature.icon}
              </Box>
              <Typography variant="h5" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {!user?.society && (
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              You're not part of any society yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Create a new society or join an existing one with an invite code
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/society/create')}
              >
                Create Society
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/society/join')}
              >
                Join Society
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
