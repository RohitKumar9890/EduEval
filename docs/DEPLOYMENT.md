# Deployment Guide

This guide covers deploying EduEval to various platforms.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Deployment Options](#deployment-options)
  - [Render.com](#rendercom)
  - [Vercel (Frontend)](#vercel-frontend)
  - [Railway](#railway)
  - [Docker](#docker)
  - [VPS/Cloud Server](#vpscloud-server)

---

## Environment Variables

### Backend Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# JWT (Generate with: npm run generate-secrets)
JWT_SECRET=your-secure-random-secret
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-secure-refresh-secret
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
CLIENT_URL=https://your-frontend-domain.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM_NAME=EduEval

# Code Execution
CODE_EXECUTION_TIMEOUT=10000
CODE_EXECUTION_MEMORY_LIMIT=256

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=10
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

---

## Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project" or select existing project

2. **Enable Firestore Database**
   - Navigate to Firestore Database
   - Click "Create Database"
   - Choose production mode
   - Select a region

3. **Get Service Account Credentials**
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

4. **For Deployment:**
   - Extract values from the JSON file:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
     - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the \n characters)

---

## Deployment Options

### Render.com

#### Backend Deployment

1. **Push code to GitHub**

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Root Directory:** Leave empty

4. **Set Environment Variables**
   - Add all backend environment variables listed above
   - Use the "Generate Value" button for JWT secrets

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

#### Using render.yaml (Automated)

The project includes a `render.yaml` file for automatic deployment:

```bash
# Simply connect your repo to Render and it will use the render.yaml config
```

---

### Vercel (Frontend)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from Command Line**
   ```bash
   cd client
   vercel --prod
   ```

3. **Or Deploy via Dashboard**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Set root directory to `client`
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`

4. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

---

### Railway

1. **Create New Project**
   - Go to [Railway](https://railway.app/)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure Backend Service**
   - Add environment variables
   - Railway will auto-detect Node.js
   - Start command: `npm run start --prefix server`

3. **Configure Frontend Service**
   - Create another service for client
   - Start command: `npm run start --prefix client`

---

### Docker

#### Build and Run with Docker Compose

```bash
# Copy environment files
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local

# Edit the .env files with your configuration

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Build Individual Containers

```bash
# Backend
docker build -t edueval-server ./server
docker run -p 5000:5000 --env-file ./server/.env edueval-server

# Frontend
docker build -t edueval-client ./client
docker run -p 3000:3000 --env-file ./client/.env.local edueval-client
```

---

### VPS/Cloud Server

#### Prerequisites

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- Nginx for reverse proxy
- PM2 for process management

#### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### 2. Clone and Setup Project

```bash
# Clone repository
git clone https://github.com/yourusername/edueval.git
cd edueval

# Install dependencies
npm run install:all

# Setup environment files
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local

# Edit configuration
nano server/.env
nano client/.env.local

# Build frontend
cd client && npm run build && cd ..
```

#### 3. Setup PM2

```bash
# Start backend
pm2 start server/src/server.js --name edueval-api

# Start frontend
cd client && pm2 start npm --name edueval-client -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/edueval
```

Add configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/edueval /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal is set up automatically
```

---

## Post-Deployment Steps

1. **Test the deployment**
   ```bash
   curl https://api.yourdomain.com/api/health
   ```

2. **Seed admin user**
   ```bash
   npm run seed:admin
   ```

3. **Monitor logs**
   ```bash
   # PM2
   pm2 logs

   # Docker
   docker-compose logs -f

   # Render
   Check dashboard for logs
   ```

4. **Setup monitoring** (Optional)
   - PM2 Plus for process monitoring
   - Sentry for error tracking
   - LogRocket for user session replay

---

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] JWT secrets are randomly generated (not default values)
- [ ] Firebase credentials are configured
- [ ] CORS is restricted to your frontend domain
- [ ] HTTPS/SSL is enabled
- [ ] Firewall rules are configured
- [ ] Rate limiting is enabled
- [ ] Database backups are scheduled
- [ ] Error logging is configured
- [ ] Security headers are enabled (Helmet.js)

---

## Troubleshooting

### Build Failures

- Check Node.js version (must be 18+)
- Verify all dependencies are installed
- Check build logs for specific errors

### Connection Issues

- Verify CORS_ORIGIN matches your frontend URL
- Check firewall rules
- Ensure ports are not blocked

### Database Connection Errors

- Verify Firebase credentials
- Check Firebase console for service status
- Ensure network connectivity to Firebase

### Email Not Sending

- Verify SMTP credentials
- Check email provider settings
- Review application logs

---

## Rollback Strategy

### Render/Railway/Vercel
- Use the platform's built-in rollback feature
- Redeploy from a previous commit

### Docker
```bash
docker-compose down
git checkout <previous-commit>
docker-compose up -d --build
```

### PM2
```bash
# Stop services
pm2 stop all

# Pull previous version
git checkout <previous-commit>

# Reinstall dependencies
npm run install:all

# Restart services
pm2 restart all
```

---

## Support

For deployment issues:
- Check documentation: `/docs`
- Review logs for errors
- Create an issue on GitHub
