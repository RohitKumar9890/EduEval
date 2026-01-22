# EduEval - Educational Evaluation Platform

A comprehensive platform for managing courses, exams, and student assessments with real-time code execution capabilities.

## 🚀 Features

- **Role-Based Access Control**: Admin, Faculty, and Student roles with specific permissions
- **Exam Management**: Create, schedule, and manage exams with various question types
- **Real-Time Code Execution**: Run and evaluate code submissions in multiple programming languages
- **Material Management**: Upload and share course materials
- **Progress Tracking**: Monitor student performance and progress
- **Announcements**: Broadcast important updates to students
- **Excel Import/Export**: Bulk user management and data export capabilities
- **Email Notifications**: Automated notifications for important events

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Docker** (for code execution and optional database)
- **Firebase Account** (for authentication and database)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/edueval.git
cd edueval
```

### 2. Install Dependencies

```bash
npm run install:all
```

Or install manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 3. Environment Configuration

#### Backend Configuration

```bash
# Copy the example env file
cp server/.env.example server/.env
```

Edit `server/.env` and configure the following:

```env
# Server
NODE_ENV=development
PORT=5000

# Firebase (Required)
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# JWT Secrets (Generate with: npm run generate-secrets)
JWT_SECRET=your-generated-secret
JWT_REFRESH_SECRET=your-generated-refresh-secret

# CORS
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000

# Email (Required for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Frontend Configuration

```bash
# Copy the example env file
cp client/.env.local.example client/.env.local
```

Edit `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save the file as `server/firebase-service-account.json`

### 5. Generate JWT Secrets

```bash
npm run generate-secrets
```

Copy the generated secrets to your `server/.env` file.

### 6. Seed Admin User

```bash
npm run seed:admin
```

Default admin credentials:
- Email: `admin@edueval.local`
- Password: `Admin@12345`

## 🚀 Running the Application

### Development Mode

#### Option 1: Run Both Servers Concurrently

```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) simultaneously.

#### Option 2: Run Servers Separately

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

#### Option 3: Using Docker Compose

```bash
npm run docker:up
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

### Production Mode

```bash
# Build the client
npm run build

# Start the server
npm run start:server

# Start the client (in another terminal)
npm run start:client
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 System Check

Verify your setup is correct:

```bash
npm run check-setup
```

This will check:
- Environment files
- Firebase configuration
- Running servers
- Database connectivity

## 🏗️ Project Structure

```
edueval/
├── client/                 # Next.js frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── lib/          # Utility functions and API client
│   │   ├── pages/        # Next.js pages and routes
│   │   └── styles/       # Global styles
│   └── package.json
├── server/                # Express backend API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── scripts/      # Utility scripts
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   ├── tests/            # Test files
│   └── package.json
├── scripts/              # Root-level utility scripts
├── docker-compose.yml    # Docker orchestration
├── package.json          # Root package configuration
└── README.md            # This file
```

## 🎯 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/request-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Role-Based Endpoints

#### Admin (`/api/admin`)
- User management
- Subject, semester, and section management
- Bulk import/export

#### Faculty (`/api/faculty`)
- Exam creation and management
- Material upload
- Submission grading
- Announcements

#### Student (`/api/student`)
- Exam participation
- Material access
- Progress tracking
- Enrollment

## 🐳 Docker Commands

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# View logs
npm run docker:logs

# Rebuild containers
docker-compose up -d --build
```

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting on API endpoints
- Helmet.js security headers
- Input validation with express-validator
- Password hashing with bcrypt
- CORS protection

## 📧 Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the app password in `SMTP_PASS`

For other providers, configure SMTP settings accordingly.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Backend server won't start
- Check if port 5000 is available
- Verify Firebase credentials are correct
- Ensure MongoDB is running (if using local instance)

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` in `client/.env.local`
- Check CORS settings in `server/.env`
- Ensure backend is running

### Code execution not working
- Verify Docker daemon is running
- Check Docker permissions
- Review code execution timeout settings

### Email notifications not working
- Verify SMTP credentials
- Check email service configuration
- Review application logs for errors

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review error logs in the console

## 🎓 Default User Roles

After seeding, you can create additional users:

- **Admin**: Full system access
- **Faculty**: Course and exam management
- **Student**: Course enrollment and exam participation

---

**Made with ❤️ for education**
