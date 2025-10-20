import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip
} from '@mui/material';
import { MeetingRoom as RoomIcon } from '@mui/icons-material';
import { roomService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadRooms();
  }, [user]);

  const loadRooms = async () => {
    if (!user.society) {
      setLoading(false);
      return;
    }

    try {
      const response = await roomService.getAll(user.society);
      setRooms(response.data);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  if (!user.society) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <RoomIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            You need to join a society first
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Meeting Rooms</Typography>
        {['president', 'vicepresident'].includes(user.role) && (
          <Button variant="contained" onClick={() => window.location.href = '/rooms/create'}>
            Add Room
          </Button>
        )}
      </Box>

      {rooms.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <RoomIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No rooms available
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <RoomIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="div">
                      {room.name}
                    </Typography>
                  </Box>

                  {room.building && (
                    <Typography variant="body2" color="text.secondary">
                      Building: {room.building}
                      {room.floor && `, Floor ${room.floor}`}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Chip
                      label={`Capacity: ${room.capacity}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {room.amenities && room.amenities.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Amenities:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {room.amenities.map((amenity, index) => (
                          <Chip
                            key={index}
                            label={amenity}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => window.location.href = `/rooms/${room._id}/availability`}
                  >
                    View Availability
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Rooms;
