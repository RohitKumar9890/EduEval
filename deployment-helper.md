# 🚀 Quick Deployment Commands

## Generate JWT Secrets

Run this on your local machine:

```bash
node generate-jwt-secrets.js
```

Or use this one-liner:

```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex')); console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'));"
```

---

## Extract Firebase Credentials from JSON

If you have `firebase-service-account.json`, extract the values:

**On Windows PowerShell:**
```powershell
$firebase = Get-Content server/firebase-service-account.json | ConvertFrom-Json
Write-Host "FIREBASE_PROJECT_ID=$($firebase.project_id)"
Write-Host "FIREBASE_CLIENT_EMAIL=$($firebase.client_email)"
Write-Host "FIREBASE_PRIVATE_KEY=`"$($firebase.private_key)`""
```

**On Mac/Linux:**
```bash
cat server/firebase-service-account.json | jq -r '"FIREBASE_PROJECT_ID=" + .project_id, "FIREBASE_CLIENT_EMAIL=" + .client_email, "FIREBASE_PRIVATE_KEY=\"" + .private_key + "\""'
```

**Manual Method:**
1. Open `server/firebase-service-account.json` in a text editor
2. Copy the values for:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (include the quotes and keep \n as literal \n)

---

## Test Your Deployed Backend

Replace `YOUR-BACKEND-URL` with your actual Render URL:

```bash
# Test health endpoint
curl https://YOUR-BACKEND-URL.onrender.com/api/health

# Should return: {"status":"success","message":"Server is running"}
```

---

## Test Your Deployed Frontend

Just visit your Vercel URL in a browser:
```
https://YOUR-APP-NAME.vercel.app
```

---

## Check Deployment Status

**Render:**
```
https://dashboard.render.com
```

**Vercel:**
```
https://vercel.com/dashboard
```

---

## Redeploy After Changes

### Redeploy Backend (Render)
Push to GitHub, Render auto-deploys:
```bash
git add .
git commit -m "Update backend"
git push
```

Or manually trigger in Render Dashboard:
- Go to your service → Click "Manual Deploy" → "Deploy latest commit"

### Redeploy Frontend (Vercel)
Push to GitHub, Vercel auto-deploys:
```bash
git add .
git commit -m "Update frontend"
git push
```

Or manually trigger in Vercel Dashboard:
- Go to your project → Deployments → Click "Redeploy"

---

## Environment Variables Quick Reference

### Render (Backend)
```env
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JWT_SECRET=your-generated-secret-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-other-generated-secret-here
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=https://your-app.vercel.app
CLIENT_URL=https://your-app.vercel.app
```

### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## Seed Admin User in Production

Via Render Shell:
```bash
npm run seed:admin
```

Via Render REST API (if shell doesn't work):
```bash
curl -X POST https://api.render.com/v1/services/YOUR_SERVICE_ID/jobs \
  -H "Authorization: Bearer YOUR_RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"command":"npm run seed:admin"}'
```

---

## Monitor Your App

**Check Backend Logs:**
```
Render Dashboard → Your Service → Logs
```

**Check Frontend Logs:**
```
Vercel Dashboard → Your Project → Deployments → Click latest → View Function Logs
```

**Check Firebase Usage:**
```
Firebase Console → Usage and Billing
```

---

## Custom Domain Setup (Optional)

### Add Custom Domain to Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `edueval.com`)
3. Update DNS records as instructed by Vercel
4. Wait for SSL certificate to be issued (automatic)

### Add Custom Domain to Render
1. Go to Render Dashboard → Your Service → Settings → Custom Domain
2. Add your API subdomain (e.g., `api.edueval.com`)
3. Update DNS records as instructed by Render
4. Wait for SSL certificate (automatic)

### Update Environment Variables
After adding custom domains, update:

**Render:**
```env
CORS_ORIGIN=https://edueval.com
CLIENT_URL=https://edueval.com
```

**Vercel:**
```env
NEXT_PUBLIC_API_URL=https://api.edueval.com
```

---

## Free Tier Limits

### Render Free Tier
- ✅ 750 hours/month free compute time
- ✅ 512 MB RAM
- ✅ Auto-sleep after 15 min inactivity
- ❌ No persistent disk storage (uploads won't persist across restarts)

### Vercel Free Tier
- ✅ Unlimited websites
- ✅ 100 GB bandwidth/month
- ✅ 100 builds/day
- ✅ Commercial use allowed

### Firebase Free Tier (Spark Plan)
- ✅ 1 GB Firestore storage
- ✅ 50K reads/day
- ✅ 20K writes/day
- ✅ 20K deletes/day

---

## Upgrade Options (If You Outgrow Free Tier)

| Service | Paid Plan | Monthly Cost | Benefits |
|---------|-----------|--------------|----------|
| **Render** | Starter | $7/month | Always-on, 512 MB RAM, faster |
| **Vercel** | Pro | $20/month | More bandwidth, faster builds |
| **Firebase** | Blaze | Pay-as-you-go | Higher limits, only pay for usage |

**Recommendation:** Start with free tier, upgrade only when needed!

---

## Troubleshooting Commands

### Check if Git is initialized
```bash
git status
```

### Check if remote is set
```bash
git remote -v
```

### Check Node version (should be 18+)
```bash
node --version
```

### Test local servers before deployment
```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend  
cd client
npm install
npm run dev
```

### Clear npm cache if having issues
```bash
npm cache clean --force
```

---

## Quick Links

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Firebase Console:** https://console.firebase.google.com
- **GitHub:** https://github.com
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Firebase Docs:** https://firebase.google.com/docs

---

**Need help? Check the DEPLOYMENT-GUIDE.md for detailed instructions!**
