# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // Optional validation errors
}
```

---

## Authentication Endpoints

### Register User

**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

### Login

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Refresh Token

**POST** `/api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

### Get Current User

**GET** `/api/auth/me`

**Headers:** `Authorization: Bearer <token>`

### Request Password Reset

**POST** `/api/auth/request-reset`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password

**POST** `/api/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "NewPassword123!"
}
```

---

## Admin Endpoints

All admin endpoints require authentication with `admin` role.

### User Management

#### Get All Users

**GET** `/api/admin/users`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `role` - Filter by role
- `search` - Search by name or email

#### Create User

**POST** `/api/admin/users`

#### Update User

**PUT** `/api/admin/users/:id`

#### Delete User

**DELETE** `/api/admin/users/:id`

### Subject Management

#### Get All Subjects

**GET** `/api/admin/subjects`

#### Create Subject

**POST** `/api/admin/subjects`

**Request Body:**
```json
{
  "name": "Computer Science 101",
  "code": "CS101",
  "semester": "semester_id",
  "faculty": "faculty_user_id"
}
```

### Semester Management

#### Get All Semesters

**GET** `/api/admin/semesters`

#### Create Semester

**POST** `/api/admin/semesters`

### Section Management

#### Get All Sections

**GET** `/api/admin/sections`

#### Create Section

**POST** `/api/admin/sections`

### Import/Export

#### Export Users to Excel

**GET** `/api/admin/export/users`

#### Import Users from Excel

**POST** `/api/admin/import/users`

---

## Faculty Endpoints

All faculty endpoints require authentication with `faculty` role.

### Exam Management

#### Get My Exams

**GET** `/api/faculty/exams`

#### Create Exam

**POST** `/api/faculty/exams`

**Request Body:**
```json
{
  "title": "Midterm Exam",
  "subject": "subject_id",
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T12:00:00Z",
  "duration": 120,
  "questions": [
    {
      "type": "mcq",
      "question": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1,
      "points": 10
    }
  ]
}
```

#### Get Exam Details

**GET** `/api/faculty/exams/:id`

#### Update Exam

**PUT** `/api/faculty/exams/:id`

#### Delete Exam

**DELETE** `/api/faculty/exams/:id`

### Material Management

#### Get My Materials

**GET** `/api/faculty/materials`

#### Upload Material

**POST** `/api/faculty/materials`

**Content-Type:** `multipart/form-data`

### Submission Management

#### Get Exam Submissions

**GET** `/api/faculty/submissions/:examId`

#### Grade Submission

**PUT** `/api/faculty/submissions/:id/grade`

### Announcements

#### Create Announcement

**POST** `/api/faculty/announcements`

#### Get My Announcements

**GET** `/api/faculty/announcements`

---

## Student Endpoints

All student endpoints require authentication with `student` role.

### Exam Management

#### Get My Enrolled Exams

**GET** `/api/student/exams`

#### Join Exam by Code

**POST** `/api/student/exams/join`

**Request Body:**
```json
{
  "examCode": "ABC123"
}
```

#### Get Exam Details

**GET** `/api/student/exams/:id`

#### Submit Exam

**POST** `/api/student/exams/:id/submit`

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "q1",
      "answer": 1
    }
  ]
}
```

### Materials

#### Get My Materials

**GET** `/api/student/materials`

### Progress

#### Get My Progress

**GET** `/api/student/progress`

### Announcements

#### Get My Announcements

**GET** `/api/student/announcements`

---

## Code Execution Endpoint

### Execute Code

**POST** `/api/code/execute`

**Request Body:**
```json
{
  "language": "python",
  "code": "print('Hello World')",
  "testCases": [
    {
      "input": "",
      "expectedOutput": "Hello World\n"
    }
  ]
}
```

**Supported Languages:**
- `python`
- `javascript`
- `java`
- `cpp`

---

## Health Check

### Check API Health

**GET** `/api/health`

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T12:00:00Z"
}
```
