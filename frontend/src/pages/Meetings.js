import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip
} from '@mui/material';
import { meetingService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadMeetings();
  }, [user]);

  const loadMeetings = async () => {
    try {
      const response = await meetingService.getAll({
        society: user.society
      });
      setMeetings(response.data);
    } catch (error) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (meetingId, status) => {
    try {
      await meetingService.respond(meetingId, status);
      toast.success(`Response recorded: ${status}`);
      loadMeetings();
    } catch (error) {
      toast.error('Failed to respond to meeting');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'info',
      ongoing: 'warning',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Meetings</Typography>
        {['president', 'vicepresident', 'excom'].includes(user.role) && (
          <Button variant="contained" onClick={() => window.location.href = '/meetings/create'}>
            Schedule Meeting
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Organizer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No meetings scheduled
                </TableCell>
              </TableRow>
            ) : (
              meetings.map((meeting) => (
                <TableRow key={meeting._id}>
                  <TableCell>{meeting.title}</TableCell>
                  <TableCell>
                    {new Date(meeting.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {meeting.room?.name || meeting.location || 'TBD'}
                  </TableCell>
                  <TableCell>{meeting.organizer?.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={meeting.status}
                      color={getStatusColor(meeting.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleRespond(meeting._id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleRespond(meeting._id, 'declined')}
                      >
                        Decline
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Meetings;
