# MeetHub - Society Management and Scheduling Platform

MeetHub is a comprehensive MERN stack application designed for university societies to manage their structure, schedule meetings, book rooms, and facilitate internal communication.

## 🌟 Features

### Core Functionality

- **Hierarchical Structure Management**: Organize societies with departments, sub-departments, and modules
- **Role-Based Access Control**: President, Vice President, EXCOM, Extended Members, and Members with specific permissions
- **Smart Meeting Scheduling**: AI-powered time slot suggestions based on member availability
- **Room Booking System**: Centralized room management with conflict detection
- **Real-time Notifications**: WebSocket-based updates for meetings, announcements, and changes
- **Announcements & Polls**: Society-wide communication tools
- **Member Availability Tracking**: Visual calendar showing member availability

### User Roles & Permissions

1. **President & Vice President (Root Admins)**
   - Full society management
   - Assign roles (EXCOM, Extended)
   - Delete/archive departments
   - Manage all permissions

2. **EXCOM Members**
   - Create departments and sub-departments
   - Schedule meetings
   - Manage member calendars

3. **Extended Members**
   - Add members to departments
   - Create sub-sub-departments (modules)
   - Schedule meetings within modules

4. **Members**
   - View schedules
   - Update personal availability
   - Join meetings

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for real-time updates
- Bcrypt for password hashing

### Frontend
- React.js
- Material-UI (MUI)
- React Router
- Axios
- Socket.io Client
- React Calendar
- React Toastify

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/AbdulRahmanAzam/MeetHub.git
cd MeetHub
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file based on .env.example
cp .env.example .env

# Update .env with your configuration:
# - MONGODB_URI
# - JWT_SECRET
# - EMAIL credentials (for notifications)
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (optional)
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file (optional)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Linux/Mac
mongod

# Or use MongoDB service
sudo systemctl start mongod
```

### 5. Run the Application

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm start
# App will open on http://localhost:3000
```

## 📁 Project Structure

```
MeetHub/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/              # Request handlers
│   │   ├── authController.js
│   │   ├── societyController.js
│   │   ├── departmentController.js
│   │   ├── meetingController.js
│   │   ├── roomController.js
│   │   ├── announcementController.js
│   │   ├── pollController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   └── auth.js               # Authentication & authorization
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Society.js
│   │   ├── Department.js
│   │   ├── Meeting.js
│   │   ├── Room.js
│   │   ├── Announcement.js
│   │   ├── Poll.js
│   │   └── Notification.js
│   ├── routes/                   # API routes
│   ├── utils/
│   │   └── helpers.js            # Utility functions
│   ├── server.js                 # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   └── PrivateRoute.js
│   │   ├── contexts/             # React contexts
│   │   │   └── AuthContext.js
│   │   ├── pages/                # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js
│   │   ├── services/             # API services
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── api.js            # Axios instance
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/availability` - Update availability

### Societies
- `POST /api/societies` - Create society
- `GET /api/societies/:id` - Get society details
- `PUT /api/societies/:id` - Update society
- `POST /api/societies/join` - Join with invite code
- `PUT /api/societies/:id/members/:userId/role` - Assign role
- `GET /api/societies/:id/members` - Get members

### Departments
- `POST /api/departments` - Create department
- `GET /api/departments/society/:societyId` - Get all departments
- `GET /api/departments/:id/hierarchy` - Get department hierarchy
- `PUT /api/departments/:id` - Update department
- `POST /api/departments/:id/members` - Add member
- `DELETE /api/departments/:id` - Delete department

### Meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings` - Get all meetings
- `GET /api/meetings/:id` - Get meeting details
- `PUT /api/meetings/:id` - Update meeting
- `PUT /api/meetings/:id/respond` - Respond to invitation
- `POST /api/meetings/suggest-slots` - Get best time slots
- `DELETE /api/meetings/:id` - Cancel meeting

### Rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id/availability` - Check availability
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Announcements
- `POST /api/announcements` - Create announcement
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Polls
- `POST /api/polls` - Create poll
- `GET /api/polls` - Get all polls
- `GET /api/polls/:id` - Get poll details
- `POST /api/polls/:id/vote` - Vote on poll
- `PUT /api/polls/:id/close` - Close poll
- `DELETE /api/polls/:id` - Delete poll

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meethub
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_password
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Deploy with MongoDB Atlas
3. Configure CORS for your domain

### Frontend (Vercel/Netlify)
1. Build the app: `npm run build`
2. Deploy the build folder
3. Set REACT_APP_API_URL to your backend URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Abdul Rahman Azam - [@AbdulRahmanAzam](https://github.com/AbdulRahmanAzam)

## 🙏 Acknowledgments

- Material-UI for the beautiful UI components
- MongoDB for the flexible database
- Socket.io for real-time communication

## 📞 Support

For support, email support@meethub.com or create an issue in the repository.
