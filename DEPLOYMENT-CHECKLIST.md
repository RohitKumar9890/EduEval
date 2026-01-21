# ✅ EduEval Cloud Deployment Checklist

Follow these steps in order. Check off each item as you complete it.

---

## 📋 Pre-Deployment Checklist

### ☐ Step 1: Verify You Have Firebase Project Set Up
- [ ] You have a Firebase project created at https://console.firebase.google.com
- [ ] You have the `firebase-service-account.json` file downloaded
- [ ] You can access Firestore Database in Firebase Console

**If you DON'T have Firebase set up yet:**
1. Go to https://console.firebase.google.com
2. Click "Add project" or use existing project
3. Name it "EduEval" (or your preferred name)
4. Enable Google Analytics (optional)
5. Go to Project Settings (⚙️ icon) → Service Accounts
6. Click "Generate New Private Key"
7. Save the JSON file as `firebase-service-account.json`
8. Go to Firestore Database → Create Database → Start in Test Mode → Choose location

---

## 🚀 Deployment Steps

### ☐ Step 2: Prepare Your Code Repository

**Check if you have Git initialized:**
```bash
git status
```

**If NOT initialized, run:**
```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

**Push to GitHub:**
- [ ] Create a new repository on GitHub: https://github.com/new
- [ ] Name it "edueval" or similar
- [ ] Don't initialize with README (your repo already has files)
- [ ] Copy the repository URL

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

---

### ☐ Step 3: Deploy Backend to Render.com

#### 3.1: Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub (recommended) or email
- [ ] Verify your email

#### 3.2: Create Web Service
- [ ] Click "New +" button → Select "Web Service"
- [ ] Click "Connect Account" to connect GitHub
- [ ] Find and select your repository
- [ ] Click "Connect"

#### 3.3: Configure Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `edueval-api` (or your choice) |
| **Region** | Oregon (or closest to your users) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

- [ ] All settings configured

#### 3.4: Add Environment Variables
Click "Environment" → "Add Environment Variable" and add these:

**Required Variables:**
```env
NODE_ENV=production
PORT=5000
```

**Firebase Credentials (from your firebase-service-account.json file):**
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

⚠️ **Important for FIREBASE_PRIVATE_KEY:**
- Copy the ENTIRE private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep it in quotes
- Make sure `\n` characters are preserved (they should be literal \n, not actual newlines)

**JWT Secrets (generate random strings):**
```env
JWT_SECRET=GENERATE_RANDOM_64_CHARACTER_STRING
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=GENERATE_DIFFERENT_RANDOM_64_CHARACTER_STRING
JWT_REFRESH_EXPIRE=30d
```

**CORS (temporary - will update later):**
```env
CORS_ORIGIN=*
CLIENT_URL=http://localhost:3000
```

**Optional but recommended:**
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
```

- [ ] All environment variables added

**How to generate JWT secrets:**
Run this in your terminal (on your PC):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Run it twice to get two different secrets.

#### 3.5: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes for deployment
- [ ] Check logs for any errors
- [ ] Copy your backend URL (e.g., `https://edueval-api.onrender.com`)

#### 3.6: Test Backend
- [ ] Visit `https://YOUR-BACKEND-URL.onrender.com/api/health`
- [ ] You should see: `{"status":"success","message":"Server is running"}`

**If you see an error:**
1. Check Render logs (Dashboard → Your Service → Logs)
2. Verify Firebase credentials are correct
3. Verify no syntax errors in environment variables

---

### ☐ Step 4: Deploy Frontend to Vercel

#### 4.1: Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub (recommended)

#### 4.2: Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Find your repository and click "Import"
- [ ] Vercel will auto-detect Next.js

#### 4.3: Configure Build Settings
**IMPORTANT: Override these settings:**

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `client` ← **CLICK EDIT AND SET THIS!** |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `.next` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |

- [ ] Root Directory set to `client`

#### 4.4: Add Environment Variable
Click "Environment Variables" and add:

```env
NEXT_PUBLIC_API_URL=https://YOUR-RENDER-BACKEND-URL.onrender.com
```

⚠️ **Replace with YOUR actual Render URL from Step 3.5**

- [ ] Environment variable added

#### 4.5: Deploy
- [ ] Click "Deploy"
- [ ] Wait 3-5 minutes
- [ ] Copy your frontend URL (e.g., `https://edueval-xyz123.vercel.app`)

#### 4.6: Test Frontend
- [ ] Visit your Vercel URL
- [ ] You should see the EduEval homepage/login page

---

### ☐ Step 5: Update Backend CORS Settings

Now that frontend is deployed, update backend to only allow your frontend:

- [ ] Go back to Render Dashboard
- [ ] Click on your `edueval-api` service
- [ ] Go to "Environment" tab
- [ ] Update these variables:

```env
CORS_ORIGIN=https://your-vercel-app.vercel.app
CLIENT_URL=https://your-vercel-app.vercel.app
```

- [ ] Click "Save Changes"
- [ ] Wait for automatic redeployment (2-3 minutes)

---

### ☐ Step 6: Create Admin User

You need to seed the admin user in production database:

**Option A: Using Render Shell (Recommended)**
- [ ] Go to Render Dashboard → Your Service
- [ ] Click "Shell" tab (top right)
- [ ] Run: `npm run seed:admin`
- [ ] Wait for success message

**Option B: Manually via Firebase Console**
If shell doesn't work:
1. Go to Firebase Console → Firestore Database
2. Create collection `users`
3. Add document with these fields (see your seedAdmin.js for exact structure)

**Default Admin Credentials:**
- Email: `admin@edueval.local` (from .env.example)
- Password: `Admin@12345` (from .env.example)

- [ ] Admin user created

---

## 🎉 Step 7: Test Your Deployed App

- [ ] Visit your Vercel URL
- [ ] Try to login with admin credentials
- [ ] Check if login works
- [ ] Navigate through different pages
- [ ] Test creating users, subjects, etc.

**If login doesn't work:**
1. Open browser console (F12)
2. Check for CORS errors
3. Verify API URL in Network tab
4. Check Render logs for backend errors

---

## 📱 Step 8: Share with Testers

Your app is now live! 🎊

**Share these with your testers:**
- **App URL:** `https://your-app.vercel.app`
- **Admin Credentials:** (if they need admin access)
  - Email: `admin@edueval.local`
  - Password: `Admin@12345`

**Create test accounts for testers:**
- [ ] Create faculty test accounts
- [ ] Create student test accounts
- [ ] Share credentials with testers

---

## 🔒 Post-Deployment Security

- [ ] Change default admin password immediately after first login
- [ ] Set up proper CORS (not `*`)
- [ ] Review Firebase security rules
- [ ] Add your domain to Firebase authorized domains
- [ ] Consider adding custom domain (optional)

---

## 🐛 Common Issues

### Issue: "Failed to fetch" or CORS errors
**Solution:** 
- Verify `CORS_ORIGIN` in Render matches Vercel URL exactly (including https://)
- Check browser console for exact error
- Wait 2-3 minutes after updating CORS settings for Render to redeploy

### Issue: Backend is very slow on first request
**Solution:**
- Render free tier sleeps after 15 min inactivity
- First request takes 30-60 seconds to "wake up"
- This is normal behavior on free tier

### Issue: Firebase authentication errors
**Solution:**
- Verify all 3 Firebase env variables are set correctly
- Check that private key has proper `\n` characters
- Verify project_id matches your Firebase project

### Issue: "Cannot find module" errors
**Solution:**
- Check that Root Directory is set to `server` in Render
- Check that Root Directory is set to `client` in Vercel
- Verify package.json exists in those directories

---

## 📊 Your Deployment URLs

Fill these in once deployed:

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | `https://_________________.vercel.app` |
| **Backend (Render)** | `https://_________________.onrender.com` |
| **Firebase Console** | `https://console.firebase.google.com/project/_________` |

---

## 🆘 Need Help?

**Render Dashboard:** https://dashboard.render.com
**Vercel Dashboard:** https://vercel.com/dashboard
**Firebase Console:** https://console.firebase.google.com

**Check Logs:**
- Render: Dashboard → Service → Logs tab
- Vercel: Dashboard → Project → Deployments → Click deployment → View Function Logs
- Firebase: Console → Firestore Database

---

**All done? Your app is now accessible to anyone worldwide! 🌍**
