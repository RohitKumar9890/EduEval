# 🚀 RENDER + VERCEL DEPLOYMENT GUIDE

Follow these steps exactly to deploy your EduEval application!

---

## 📋 PHASE 1: LOCAL TESTING & PREPARATION (15 minutes)

### Step 1.1: Test Your Application Locally

```bash
# Make sure you're in the project root directory
cd /path/to/edueval

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

**Wait for both servers to start:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

**Test the application:**
1. Open http://localhost:3000 in your browser
2. Try logging in with admin credentials:
   - Email: `admin@edueval.local`
   - Password: `Admin@12345`
3. If login works, you're ready to deploy! ✅

**If there are errors:**
- Check that Firebase credentials are correct in `server/.env`
- Verify `server/firebase-service-account.json` exists
- Check console for error messages

---

### Step 1.2: Generate Production JWT Secrets

```bash
# Generate new secrets (IMPORTANT: Don't use dev secrets in production!)
npm run generate-secrets
```

**Copy the output** - you'll need these values:
```
JWT_SECRET: <copy-this-long-string>
JWT_REFRESH_SECRET: <copy-this-long-string>
```

**Save these somewhere safe!** You'll enter them in Render.

---

### Step 1.3: Gather Firebase Credentials

Open `server/firebase-service-account.json` and find these values:

```json
{
  "project_id": "<YOUR_PROJECT_ID>",
  "private_key": "<YOUR_PRIVATE_KEY>",
  "client_email": "<YOUR_CLIENT_EMAIL>"
}
```

**Copy these three values** - you'll need them for Render.

⚠️ **IMPORTANT:** For `private_key`, keep the entire string including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

---

### Step 1.4: Setup Email (Optional but Recommended)

For Gmail:
1. Go to your Google Account
2. Enable 2-Factor Authentication
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Copy the 16-character app password

You'll need:
- `SMTP_USER`: your-email@gmail.com
- `SMTP_PASS`: your-app-password

---

### Step 1.5: Push Code to GitHub

```bash
# Initialize git if you haven't already
git init
git add .
git commit -m "Prepare for deployment"

# Push to GitHub (create a repo first at github.com)
git remote add origin https://github.com/YOUR_USERNAME/edueval.git
git branch -M main
git push -u origin main
```

---

## 🔧 PHASE 2: DEPLOY BACKEND TO RENDER (10 minutes)

### Step 2.1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (easiest)
3. Authorize Render to access your GitHub repos

---

### Step 2.2: Create New Web Service

1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Render will detect `render.yaml` automatically
4. Click **"Apply"**

---

### Step 2.3: Add Environment Variables

Render will create the service, but you need to add Firebase and other secrets manually.

Go to your service → **"Environment"** tab → Add these variables:

**Required Variables:**

```bash
NODE_ENV=production
PORT=5000

# Firebase (from Step 1.3)
FIREBASE_PROJECT_ID=<your-project-id>
FIREBASE_CLIENT_EMAIL=<your-client-email>
FIREBASE_PRIVATE_KEY=<your-private-key>
FIREBASE_DATABASE_URL=https://<your-project-id>.firebaseio.com

# JWT Secrets (from Step 1.2)
JWT_SECRET=<generated-secret>
JWT_REFRESH_SECRET=<generated-refresh-secret>
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS - UPDATE AFTER VERCEL DEPLOYMENT
CORS_ORIGIN=https://your-app.vercel.app
CLIENT_URL=https://your-app.vercel.app

# Email (from Step 1.4)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@edueval.com

# Optional
CODE_EXECUTION_TIMEOUT=10000
CODE_EXECUTION_MEMORY_LIMIT=256
```

⚠️ **NOTE:** You'll update `CORS_ORIGIN` and `CLIENT_URL` after deploying to Vercel!

---

### Step 2.4: Deploy Backend

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait for deployment (5-10 minutes)
3. Check logs for errors
4. Once deployed, you'll get a URL like: `https://edueval-api.onrender.com`

**Test your backend:**
```bash
# Visit this URL in browser:
https://your-render-url.onrender.com/api/health

# Should return:
{"status":"ok","timestamp":"..."}
```

✅ **Backend deployed!** Copy your Render URL - you'll need it for Vercel.

---

## 🎨 PHASE 3: DEPLOY FRONTEND TO VERCEL (5 minutes)

### Step 3.1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

---

### Step 3.2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

---

### Step 3.3: Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `client`

**Build Command:** `npm run build` (auto-detected)

**Environment Variables:**
Click "Add Environment Variable"

```bash
NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com
```

Replace `your-render-url` with your actual Render URL from Step 2.4

---

### Step 3.4: Deploy Frontend

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Vercel will give you a URL like: `https://edueval-xyz.vercel.app`

✅ **Frontend deployed!**

---

## 🔄 PHASE 4: UPDATE BACKEND CORS (2 minutes)

Now that you have your Vercel URL, update the backend:

### Step 4.1: Update Render Environment Variables

1. Go back to Render dashboard
2. Select your backend service
3. Go to **"Environment"** tab
4. Update these variables:

```bash
CORS_ORIGIN=https://your-app.vercel.app
CLIENT_URL=https://your-app.vercel.app
```

Replace with your actual Vercel URL

---

### Step 4.2: Redeploy Backend

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait for redeployment

---

## 👤 PHASE 5: SEED ADMIN USER (3 minutes)

### Option A: Using Render Shell

1. Go to Render dashboard → Your service
2. Click **"Shell"** tab
3. Run:
```bash
cd server
npm run seed:admin
```

### Option B: Using Render API or Local Script

If shell doesn't work, you can trigger the seed script through your deployed API or run it locally pointing to production Firebase.

---

## ✅ PHASE 6: TEST YOUR DEPLOYMENT

### Step 6.1: Visit Your App

Go to: `https://your-app.vercel.app`

### Step 6.2: Login

Use default admin credentials:
- Email: `admin@edueval.local`
- Password: `Admin@12345`

### Step 6.3: Change Admin Password

**IMPORTANT:** Change the default password immediately!

1. Go to Profile/Settings
2. Change password
3. Update email if needed

---

## 🎉 DEPLOYMENT COMPLETE!

Your application is now live:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-render-url.onrender.com

---

## 📊 POST-DEPLOYMENT TASKS

### Security
- [ ] Change default admin password
- [ ] Create faculty and student test accounts
- [ ] Test all major features
- [ ] Setup custom domain (optional)

### Monitoring
- [ ] Check Render logs regularly
- [ ] Monitor Vercel analytics
- [ ] Setup error tracking (Sentry - optional)

### Backups
- [ ] Firebase data is automatically backed up
- [ ] Export user data regularly via admin panel

---

## 🚨 TROUBLESHOOTING

### Frontend can't connect to Backend

**Error:** Network error or CORS error

**Fix:**
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Verify `CORS_ORIGIN` in Render matches your Vercel URL
3. Redeploy both services

### Backend crashes on startup

**Check Render logs for:**
- Firebase connection errors → Verify Firebase credentials
- Missing environment variables → Add them in Render dashboard
- Port binding issues → Should use PORT=5000

### Email not working

**Check:**
- SMTP credentials are correct
- Gmail App Password (not regular password)
- Email FROM address is valid

### Admin seed fails

**Fix:**
1. Check Firebase connection
2. Verify credentials in environment variables
3. Try running seed script multiple times

---

## 🔄 UPDATING YOUR DEPLOYMENT

When you make code changes:

```bash
# 1. Commit changes
git add .
git commit -m "Your changes"
git push origin main

# 2. Both Render and Vercel will auto-deploy!
# (If you enabled auto-deploy)
```

---

## 💰 COST BREAKDOWN

### Free Tier (What you're using):
- **Render:** 750 hours/month free (1 service)
- **Vercel:** Unlimited deployments
- **Firebase:** 50K reads, 20K writes per day
- **Total:** $0/month ✅

### When you outgrow free tier:
- **Render Starter:** $7/month
- **Vercel Pro:** $20/month (if needed)
- **Firebase Blaze:** Pay-as-you-go (starts cheap)

---

## 📞 NEED HELP?

- Check logs in Render/Vercel dashboards
- Review error messages carefully
- Check Firebase console for database issues
- Refer to `docs/DEPLOYMENT.md` for more details

---

**Good luck with your deployment! 🚀**
