# SDS App - Scout Management System

## 🎯 Objective
A comprehensive application for managing administrative and operational tasks for Senegalese Scouting.

## 🚀 Features

### Phase 1: Administrative Management
- ✅ Camping Authorization System
  - Group leaders can submit camping requests
  - District commissioners can review and approve/reject requests
  - Real-time notifications for leaders
  - Detailed audit trails

## 🏗️ Architecture

### Backend (Node.js + Express + PostgreSQL)
- RESTful API
- Real-time notifications via Socket.IO
- JWT authentication
- Role-based access control
- Database schema with proper indexes

### Frontend (React + Tailwind CSS)
- Responsive UI
- Form validation
- Real-time notifications
- Intuitive admin dashboard

## 📋 Database Schema

### Core Tables
- `users` - User accounts with roles
- `districts` - Scout districts
- `scout_groups` - Scout groups within districts
- `camping_authorizations` - Camping requests and approvals
- `notifications` - User notifications
- `audit_logs` - Action audit trails

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update database credentials in .env

# Run migrations
npm run migrate

# Start server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file with API URL
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

## 📚 API Endpoints

### Camping Authorizations
- `POST /api/camping-authorizations` - Create new request
- `GET /api/camping-authorizations/:id` - Get authorization details
- `GET /api/camping-authorizations/pending` - Get pending requests
- `GET /api/camping-authorizations/my/requests` - Get user's requests
- `POST /api/camping-authorizations/:id/approve` - Approve request
- `POST /api/camping-authorizations/:id/reject` - Reject request

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread/count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 🔐 Authentication
- JWT token-based authentication
- Token stored in localStorage
- Automatic token refresh on requests

## 👥 User Roles
- `admin` - Full system access
- `district_commissioner` - District-level approvals
- `group_leader` - Scout group management
- `scout` - Basic scout member

## 📧 Notifications
- Real-time via Socket.IO
- Email notifications (future)
- In-app notification center
- Read/unread status tracking

## 🚦 Next Steps
1. Deploy database
2. Test API endpoints
3. Implement authentication pages
4. Add email notification service
5. Develop dashboard

## 📞 Support
For issues or questions, please contact the development team.
