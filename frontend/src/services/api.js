import api from '../utils/api';

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  updateAvailability: async (availability) => {
    const response = await api.put('/auth/availability', { availability });
    return response.data;
  }
};

// Society services
export const societyService = {
  create: async (societyData) => {
    const response = await api.post('/societies', societyData);
    return response.data;
  },

  get: async (id) => {
    const response = await api.get(`/societies/${id}`);
    return response.data;
  },

  update: async (id, societyData) => {
    const response = await api.put(`/societies/${id}`, societyData);
    return response.data;
  },

  join: async (inviteCode) => {
    const response = await api.post('/societies/join', { inviteCode });
    return response.data;
  },

  assignRole: async (societyId, userId, role) => {
    const response = await api.put(`/societies/${societyId}/members/${userId}/role`, { role });
    return response.data;
  },

  getMembers: async (societyId) => {
    const response = await api.get(`/societies/${societyId}/members`);
    return response.data;
  }
};

// Department services
export const departmentService = {
  create: async (departmentData) => {
    const response = await api.post('/departments', departmentData);
    return response.data;
  },

  getBySociety: async (societyId) => {
    const response = await api.get(`/departments/society/${societyId}`);
    return response.data;
  },

  getHierarchy: async (id) => {
    const response = await api.get(`/departments/${id}/hierarchy`);
    return response.data;
  },

  update: async (id, departmentData) => {
    const response = await api.put(`/departments/${id}`, departmentData);
    return response.data;
  },

  addMember: async (id, userId) => {
    const response = await api.post(`/departments/${id}/members`, { userId });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  }
};

// Meeting services
export const meetingService = {
  create: async (meetingData) => {
    const response = await api.post('/meetings', meetingData);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/meetings', { params });
    return response.data;
  },

  get: async (id) => {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  },

  update: async (id, meetingData) => {
    const response = await api.put(`/meetings/${id}`, meetingData);
    return response.data;
  },

  respond: async (id, status) => {
    const response = await api.put(`/meetings/${id}/respond`, { status });
    return response.data;
  },

  suggestSlots: async (memberIds, duration) => {
    const response = await api.post('/meetings/suggest-slots', { memberIds, duration });
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.delete(`/meetings/${id}`);
    return response.data;
  }
};

// Room services
export const roomService = {
  create: async (roomData) => {
    const response = await api.post('/rooms', roomData);
    return response.data;
  },

  getAll: async (societyId) => {
    const response = await api.get('/rooms', { params: { society: societyId } });
    return response.data;
  },

  getAvailability: async (id, startDate, endDate) => {
    const response = await api.get(`/rooms/${id}/availability`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  update: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  }
};

// Announcement services
export const announcementService = {
  create: async (announcementData) => {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },

  get: async (id) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },

  update: async (id, announcementData) => {
    const response = await api.put(`/announcements/${id}`, announcementData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  }
};

// Poll services
export const pollService = {
  create: async (pollData) => {
    const response = await api.post('/polls', pollData);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/polls', { params });
    return response.data;
  },

  get: async (id) => {
    const response = await api.get(`/polls/${id}`);
    return response.data;
  },

  vote: async (id, optionIds) => {
    const response = await api.post(`/polls/${id}/vote`, { optionIds });
    return response.data;
  },

  close: async (id) => {
    const response = await api.put(`/polls/${id}/close`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/polls/${id}`);
    return response.data;
  }
};

// Notification services
export const notificationService = {
  getAll: async (params) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};
