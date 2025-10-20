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
  LinearProgress,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@mui/material';
import { pollService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Poll as PollIcon } from '@mui/icons-material';

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    loadPolls();
  }, [user]);

  const loadPolls = async () => {
    try {
      const response = await pollService.getAll({
        society: user.society,
        isActive: true
      });
      setPolls(response.data);
    } catch (error) {
      toast.error('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    try {
      await pollService.vote(pollId, [optionId]);
      toast.success('Vote recorded successfully');
      loadPolls();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  const handleOptionChange = (pollId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [pollId]: optionId
    });
  };

  const getTotalVotes = (options) => {
    return options.reduce((total, option) => total + (option.votes?.length || 0), 0);
  };

  const getVotePercentage = (option, totalVotes) => {
    if (totalVotes === 0) return 0;
    return ((option.votes?.length || 0) / totalVotes) * 100;
  };

  const hasUserVoted = (poll) => {
    return poll.options.some(option => 
      option.votes?.some(vote => vote._id === user._id || vote === user._id)
    );
  };

  if (loading) {
    return <Container><Typography>Loading...</Typography></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Polls</Typography>
        {['president', 'vicepresident', 'excom'].includes(user.role) && (
          <Button variant="contained" onClick={() => window.location.href = '/polls/create'}>
            Create Poll
          </Button>
        )}
      </Box>

      {polls.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PollIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No active polls
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {polls.map((poll) => {
            const totalVotes = getTotalVotes(poll.options);
            const userVoted = hasUserVoted(poll);
            
            return (
              <Grid item xs={12} key={poll._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h5" component="div">
                        {poll.question}
                      </Typography>
                      {userVoted && (
                        <Chip label="Voted" color="success" size="small" />
                      )}
                    </Box>
                    
                    {poll.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {poll.description}
                      </Typography>
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Created by: {poll.createdBy?.name} | Total votes: {totalVotes}
                    </Typography>

                    {userVoted ? (
                      // Show results if user has voted
                      <Box>
                        {poll.options.map((option) => {
                          const percentage = getVotePercentage(option, totalVotes);
                          return (
                            <Box key={option._id} sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">
                                  {option.text}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {option.votes?.length || 0} votes ({percentage.toFixed(1)}%)
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{ height: 8, borderRadius: 1 }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    ) : (
                      // Show voting options if user hasn't voted
                      <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <RadioGroup
                          value={selectedOptions[poll._id] || ''}
                          onChange={(e) => handleOptionChange(poll._id, e.target.value)}
                        >
                          {poll.options.map((option) => (
                            <FormControlLabel
                              key={option._id}
                              value={option._id}
                              control={<Radio />}
                              label={option.text}
                            />
                          ))}
                        </RadioGroup>
                        <Button
                          variant="contained"
                          sx={{ mt: 2 }}
                          disabled={!selectedOptions[poll._id]}
                          onClick={() => handleVote(poll._id, selectedOptions[poll._id])}
                        >
                          Submit Vote
                        </Button>
                      </FormControl>
                    )}

                    {poll.endDate && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                        Ends: {new Date(poll.endDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Polls;
