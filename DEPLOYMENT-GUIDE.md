# 🚀 EduEval Deployment Guide - Test with Real People

This guide will help you deploy your EduEval application to the internet so real people can test it.

## 📋 Quick Overview

Your app has 3 components that need to be deployed:
1. **Database (MongoDB)** - Store your data
2. **Backend API (Node.js/Express)** - Server at port 5000
3. **Frontend (Next.js)** - Client at port 3000

## 🎯 Recommended Deployment Strategy (FREE Tier)

### Option A: Full Free Deployment (Recommended for Testing)

| Component | Platform | Cost | Setup Time |
|-----------|----------|------|------------|
| Database | MongoDB Atlas | FREE | 5 min |
| Backend | Render.com | FREE | 10 min |
| Frontend | Vercel | FREE | 5 min |

**Total Cost: $0/month** ✅

---

## 🔥 Step-by-Step Deployment

### Step 1: Deploy MongoDB Database (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a new project (name it "EduEval")

2. **Create a FREE Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Select a region close to your users
   - Cluster name: `edueval-cluster`

3. **Configure Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `edueval_user`
   - Password: Generate a secure password (SAVE THIS!)
   - Database User Privileges: "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string, it looks like:
   ```
   mongodb+srv://edueval_user:<password>@edueval-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://edueval_user:YOUR_PASSWORD@edueval-cluster.xxxxx.mongodb.net/edueval?retryWrites=true&w=majority`

---

### Step 2: Deploy Backend API (Render.com)

1. **Prepare Your Code**
   - Make sure your code is pushed to GitHub/GitLab
   - Or create a new repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (easier integration)

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `edueval-api`
     - **Region**: Oregon (or closest to you)
     - **Branch**: `main`
     - **Root Directory**: `server`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: `Free`

4. **Add Environment Variables** (CRITICAL!)
   Click "Environment" and add these variables:

   ```env
   NODE_ENV=production
   PORT=5000
   
   # MongoDB (from Step 1)
   MONGODB_URI=mongodb+srv://edueval_user:YOUR_PASSWORD@edueval-cluster.xxxxx.mongodb.net/edueval?retryWrites=true&w=majority
   
   # JWT Secrets (generate random strings)
   JWT_SECRET=your-super-long-random-secret-at-least-32-characters-long
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=another-super-long-random-secret-make-it-different
   JWT_REFRESH_EXPIRE=30d
   
   # CORS (will update after frontend deployment)
   CORS_ORIGIN=*
   
   # Client URL (will update after frontend deployment)
   CLIENT_URL=https://your-frontend-url.vercel.app
   
   # Code Execution (optional - requires Docker, may not work on free tier)
   CODE_EXECUTION_TIMEOUT=10000
   CODE_EXECUTION_MEMORY_LIMIT=256
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # File Upload
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   
   # Email (optional - for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=noreply@edueval.com
   ```

   **Important Notes:**
   - Generate JWT secrets using: https://www.uuidgenerator.net/ (click generate multiple times)
   - For Gmail SMTP: Use App Password, not your regular password
     - Go to Google Account → Security → 2-Step Verification → App Passwords

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your API will be available at: `https://edueval-api.onrender.com`

6. **Test Your API**
   - Visit: `https://edueval-api.onrender.com/api/health`
   - You should see: `{"status":"success","message":"Server is running"}`

7. **Seed Admin User** (IMPORTANT!)
   - After deployment, you need to create admin user
   - Go to Render dashboard → Your service → "Shell" tab
   - Run: `npm run seed:admin`
   - Or use Render's REST API to trigger the script

---

### Step 3: Deploy Frontend (Vercel)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. **Add Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://edueval-api.onrender.com
   ```
   ⚠️ Replace with your actual Render backend URL from Step 2

5. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes
   - Your app will be available at: `https://your-project-name.vercel.app`

6. **Update Backend CORS Settings**
   - Go back to Render dashboard
   - Update environment variables:
     ```env
     CORS_ORIGIN=https://your-project-name.vercel.app
     CLIENT_URL=https://your-project-name.vercel.app
     ```
   - Click "Save Changes" (will auto-redeploy)

---

## 🎉 You're Live! Share Your App

Your app is now accessible worldwide at:
- **Frontend**: `https://your-project-name.vercel.app`
- **Backend API**: `https://edueval-api.onrender.com`

**Default Admin Credentials** (from your .env.example):
- Email: `admin@edueval.local`
- Password: `Admin@12345`

⚠️ **IMPORTANT**: Change these credentials immediately after first login!

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Takes Long to Load First Time
**Problem**: Render free tier sleeps after 15 min of inactivity
**Solution**: 
- First request takes 30-60 seconds to wake up
- Consider using a service like [UptimeRobot](https://uptimerobot.com) to ping your API every 14 minutes
- Or upgrade to paid tier ($7/month)

### Issue 2: CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**:
- Make sure `CORS_ORIGIN` in Render matches your Vercel URL exactly
- Check browser console for exact error
- Temporarily set `CORS_ORIGIN=*` for testing (not recommended for production)

### Issue 3: Firebase Not Working
**Problem**: Authentication features using Firebase fail
**Solution**:
- You need to set up Firebase properly
- Add Firebase credentials as environment variables in Render
- See `server/.env.example` for Firebase configuration

### Issue 4: Code Execution Not Working
**Problem**: Code runner feature doesn't work
**Solution**:
- Docker is not available on Render free tier
- Code execution requires Docker daemon
- Options:
  - Deploy to Railway.app (supports Docker)
  - Deploy to your own VPS (AWS EC2, DigitalOcean)
  - Disable code execution features for testing

### Issue 5: File Uploads Not Persisting
**Problem**: Uploaded files disappear after backend restart
**Solution**:
- Render free tier has ephemeral filesystem
- Use cloud storage: AWS S3, Cloudinary, or Firebase Storage
- Modify `server/src/config/multer.js` to use cloud storage

---

## 🚀 Alternative Deployment Options

### Option B: Deploy Everything to Railway.app
- Supports Docker containers
- Has persistent storage
- MongoDB included
- $5/month with $5 free credit
- URL: https://railway.app

### Option C: Deploy to Heroku
- Similar to Render
- No longer has free tier ($5-7/month)
- Good documentation

### Option D: Deploy to Your Own Server (VPS)
- Full control
- Use DigitalOcean, AWS, or Google Cloud
- Requires Linux knowledge
- $5-10/month

### Option E: Use Ngrok for Quick Testing (Temporary)
Perfect for quick demos without permanent deployment:

1. **Install Ngrok**
   - Download from https://ngrok.com
   - Sign up for free account

2. **Start Your Local Servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

3. **Expose Backend with Ngrok**
   ```bash
   # Terminal 3
   ngrok http 5000
   ```
   - Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

4. **Update Frontend Environment**
   - Edit `client/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
   ```
   - Restart frontend

5. **Expose Frontend with Ngrok**
   ```bash
   # Terminal 4
   ngrok http 3000
   ```
   - Share this URL with testers!

**Pros**: Very quick setup (5 minutes)
**Cons**: 
- Temporary URLs (change when ngrok restarts)
- Your PC must stay on
- Limited concurrent connections on free tier
- URLs expire after 8 hours on free tier

---

## 📊 Cost Comparison

| Solution | Monthly Cost | Pros | Cons |
|----------|-------------|------|------|
| MongoDB Atlas + Render + Vercel | $0 | Free, separate services | Render sleeps, no Docker |
| Railway | $5 | All-in-one, Docker support | Costs money |
| Heroku | $7+ | Easy setup, good docs | No free tier |
| VPS (DigitalOcean) | $5-10 | Full control | Requires setup knowledge |
| Ngrok (temporary) | $0 | Instant, no setup | Temporary, PC must be on |

---

## 🔐 Security Checklist Before Testing

- [ ] Changed default admin credentials
- [ ] Generated strong JWT secrets
- [ ] Set up proper CORS origins (not `*`)
- [ ] Enabled rate limiting
- [ ] Review MongoDB network access rules
- [ ] Set NODE_ENV=production
- [ ] Don't commit .env files to Git
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Render/Vercel)

---

## 📱 Sharing Your App with Testers

Once deployed, share:
1. **Frontend URL**: `https://your-project.vercel.app`
2. **Test Credentials**: Create test accounts for different roles
3. **Feedback Form**: Google Forms or Typeform for feedback

**Create Test Accounts**:
```bash
# SSH into Render or run locally then seed to production DB
npm run seed:test
```

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Render logs: Dashboard → Your Service → Logs
3. Check Vercel logs: Dashboard → Your Project → Deployments
4. Verify environment variables are set correctly
5. Test backend health endpoint
6. Test API with Postman/Thunder Client

---

## 📈 Next Steps After Testing

1. **Collect Feedback**: Use forms, surveys, or direct communication
2. **Monitor Usage**: Set up analytics (Google Analytics, Mixpanel)
3. **Monitor Errors**: Set up error tracking (Sentry, LogRocket)
4. **Scale Up**: Upgrade to paid tiers as needed
5. **Custom Domain**: Add your own domain in Vercel/Render settings

---

## 🎓 Quick Start Commands

```bash
# Generate JWT secrets (run in terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Test API locally before deployment
cd server
npm install
npm run dev

# Test frontend locally
cd client
npm install
npm run dev

# Create Git repository (if needed)
git init
git add .
git commit -m "Initial commit"
```

---

**Good luck with your deployment! 🚀**

Your app will be accessible to anyone with internet connection once deployed!
