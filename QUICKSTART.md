# MeetHub Quick Start Guide

This guide will help you get MeetHub up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- MongoDB (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- Git - [Download](https://git-scm.com/)

## Step 1: Clone the Repository

```bash
git clone https://github.com/AbdulRahmanAzam/MeetHub.git
cd MeetHub
```

## Step 2: Setup Backend

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Environment Variables
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meethub
JWT_SECRET=your_random_secret_key_here_change_this_in_production
JWT_EXPIRE=30d

# Email Configuration (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client URL
CLIENT_URL=http://localhost:3000
```

### Start MongoDB
Make sure MongoDB is running:
```bash
# On MacOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Or run directly
mongod
```

### Start Backend Server
```bash
npm run dev
```

The backend server should now be running on `http://localhost:5000`

## Step 3: Setup Frontend

Open a new terminal window:

### Install Dependencies
```bash
cd frontend
npm install
```

### Configure Environment (Optional)
```bash
cp .env.example .env
```

The frontend will use `http://localhost:5000/api` by default.

### Start Frontend Development Server
```bash
npm start
```

The application should automatically open in your browser at `http://localhost:3000`

## Step 4: Create Your First User

1. Navigate to `http://localhost:3000`
2. Click "Get Started" or "Register"
3. Fill in your details:
   - Full Name
   - Email
   - Password
   - Confirm Password
4. Click "Register"

You'll be automatically logged in and redirected to the dashboard.

## Step 5: Create a Society

1. On the dashboard, click "Create Society"
2. Fill in society details:
   - Society Name
   - Description
   - Logo URL (optional)
3. Click "Create"

As the creator, you'll be automatically assigned as the President with full admin rights.

## Step 6: Explore Features

### Create Departments
1. Navigate to "Departments" from the main menu
2. Click "Create Department"
3. Set up your organizational hierarchy:
   - Level 1: Main departments
   - Level 2: Sub-departments
   - Level 3: Modules

### Schedule Meetings
1. Go to "Meetings"
2. Click "Schedule Meeting"
3. Fill in meeting details:
   - Title
   - Date and Time
   - Room/Location
   - Attendees
   - Agenda

### Add Rooms
1. Navigate to "Rooms"
2. Click "Add Room"
3. Enter room details:
   - Room Name
   - Building
   - Capacity
   - Amenities

### Create Announcements
1. Go to "Announcements"
2. Click "Create Announcement"
3. Write your announcement with priority level

### Create Polls
1. Navigate to "Polls"
2. Click "Create Poll"
3. Add question and options
4. Set end date (optional)

## User Roles

MeetHub has 5 user roles with different permissions:

1. **President** - Full admin access
   - Manage entire society
   - Assign all roles
   - Create/delete departments at all levels
   
2. **Vice President** - Same as President

3. **EXCOM** - Executive committee member
   - Create departments and sub-departments
   - Schedule meetings
   - Manage members in their department

4. **Extended** - Extended member
   - Create modules (level 3 departments)
   - Add members to departments
   - Schedule meetings within modules

5. **Member** - Regular member
   - View schedules
   - Update personal availability
   - Participate in meetings and polls

## Assigning Roles

As President/VP:
1. Go to Society settings
2. Navigate to Members list
3. Click on a member
4. Select new role from dropdown
5. Save changes

## Setting Availability

1. Go to your Profile
2. Click "Availability"
3. Set your available hours for each day
4. Save your availability

The system will use this information to suggest optimal meeting times.

## API Testing

You can test the API endpoints using tools like:
- Postman
- cURL
- Insomnia

### Example API Calls

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if the connection string in `.env` is correct
- Try: `mongodb://127.0.0.1:27017/meethub` instead of `localhost`

### Port Already in Use
- Backend port (5000):
  ```bash
  # Find process using port 5000
  lsof -i :5000
  # Kill the process
  kill -9 <PID>
  ```
  
- Frontend port (3000):
  ```bash
  # Find process using port 3000
  lsof -i :3000
  # Kill the process
  kill -9 <PID>
  ```

### npm Install Errors
- Clear npm cache:
  ```bash
  npm cache clean --force
  ```
- Delete `node_modules` and `package-lock.json`:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### CORS Errors
- Make sure backend is running
- Check `CLIENT_URL` in backend `.env`
- Verify frontend is accessing correct API URL

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh the browser
- Backend: Using nodemon, changes auto-restart the server

### Database Management
View your MongoDB data using:
- MongoDB Compass (GUI)
- mongo shell
- Studio 3T

### Debugging
- Backend logs appear in the terminal running the backend
- Frontend logs appear in browser console (F12)
- Use `console.log()` for debugging

## Next Steps

1. Customize the theme in `frontend/src/App.js`
2. Add your organization's logo
3. Configure email notifications
4. Set up Google OAuth (optional)
5. Deploy to production (see main README.md)

## Getting Help

- Check the main [README.md](README.md) for detailed documentation
- Review API endpoints in the README
- Open an issue on GitHub
- Contact the development team

## Useful Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm start           # Start production server

# Frontend  
cd frontend
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests

# MongoDB
mongod              # Start MongoDB
mongo               # MongoDB shell
```

Happy managing your society with MeetHub! 🎉
