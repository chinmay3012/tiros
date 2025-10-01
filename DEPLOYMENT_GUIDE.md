# 🚀 TIROS Complete Deployment Guide

This guide will walk you through deploying your full-stack TIROS e-commerce platform to production.

## 📋 What We're Deploying

Your TIROS project has 3 components:
1. **Backend API** (Node.js/Express + MongoDB)
2. **Admin Frontend** (React - for managing the store)
3. **User Frontend** (React - customer-facing website)

---

## 🎯 Deployment Stack

- **Database**: MongoDB Atlas (Free tier)
- **Backend**: Railway (Free tier)
- **Frontends**: Netlify (Free tier)

---

## Part 1: Database Setup (MongoDB Atlas) 🗄️

### Step 1: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **FREE (M0)** tier
5. Select a cloud provider and region (choose closest to you)
6. Name your cluster: `tiros-cluster`
7. Click **"Create"**

### Step 2: Create Database User

1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `tiros-admin`
5. Generate a strong password (save it!)
6. User Privileges: **"Atlas Admin"** or **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Allow Network Access

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ In production, you'd want to restrict this to specific IPs
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://tiros-admin:<password>@tiros-cluster.xxxxx.mongodb.net/
   ```
5. Replace `<password>` with your actual database password
6. **Save this connection string** - you'll need it for Railway!

---

## Part 2: Backend Deployment (Railway) 🚂

### Step 1: Prepare Your Code

1. Make sure all changes are committed to Git:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   ```

2. Push to GitHub (if not already):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/TIROS.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your TIROS repository
6. Railway will detect it's a Node.js project

### Step 3: Configure Environment Variables

1. In your Railway project, click on your service
2. Go to **"Variables"** tab
3. Add these environment variables:

   ```
   NODE_ENV=production
   PORT=3001
   MONGO_URI=mongodb+srv://tiros-admin:YOUR_PASSWORD@tiros-cluster.xxxxx.mongodb.net/
   JWT_SECRET=your_super_secret_random_string_here
   ADMIN_FRONTEND_URL=https://your-admin-frontend.netlify.app
   USER_FRONTEND_URL=https://your-user-frontend.netlify.app
   ```

   **Important:**
   - Use your actual MongoDB connection string for `MONGO_URI`
   - Generate a random string for `JWT_SECRET` (e.g., use: `openssl rand -base64 32`)
   - You'll update the frontend URLs later

### Step 4: Configure Root Directory

Railway needs to know where your backend code is:

1. In Railway, go to **"Settings"** tab
2. Find **"Root Directory"** 
3. Leave it blank (since your backend is in the root)
4. Find **"Start Command"**
5. Set it to: `npm start`

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Once deployed, click on your service to see the URL
4. Copy the URL (e.g., `https://tiros-production.up.railway.app`)
5. Test it by visiting: `https://YOUR-BACKEND-URL.railway.app/health`
   - You should see: `{"status":"OK","timestamp":"..."}`

**✅ Your backend is now live!**

---

## Part 3: Admin Frontend Deployment (Netlify) 🎨

### Step 1: Create Environment File

1. Navigate to your admin frontend:
   ```bash
   cd TIROS
   ```

2. Create `.env` file:
   ```bash
   echo "VITE_API_URL=https://YOUR-BACKEND-URL.railway.app" > .env
   ```
   Replace `YOUR-BACKEND-URL` with your actual Railway URL

### Step 2: Test Build Locally

```bash
npm run build
```

If successful, you'll see a `dist` folder created.

### Step 3: Deploy to Netlify

#### Option A: Netlify CLI (Recommended)

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy:
   ```bash
   netlify deploy --prod
   ```

4. Follow prompts:
   - Create new site? **Yes**
   - Publish directory? **dist**

#### Option B: Netlify Web Interface

1. Go to [Netlify](https://www.netlify.com)
2. Sign up/login
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect to GitHub and select your repository
5. Configure build settings:
   - Base directory: `TIROS`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL.railway.app`
7. Click **"Deploy site"**

### Step 4: Get Admin Frontend URL

Once deployed, Netlify will give you a URL like:
```
https://sparkly-unicorn-123456.netlify.app
```

**Save this URL!** You need to update Railway with it.

---

## Part 4: User Frontend Deployment (Netlify) 🛒

### Step 1: Create Environment File

1. Navigate to user frontend:
   ```bash
   cd ../user-frontend
   ```

2. Create `.env` file:
   ```bash
   echo "VITE_API_URL=https://YOUR-BACKEND-URL.railway.app/api" > .env
   ```
   ⚠️ Note the `/api` at the end!

### Step 2: Test Build

```bash
npm run build
```

### Step 3: Deploy to Netlify

Follow the same steps as Admin Frontend, but:
- Base directory: `user-frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable:
  - Key: `VITE_API_URL`
  - Value: `https://YOUR-BACKEND-URL.railway.app/api` (with `/api`)

### Step 4: Get User Frontend URL

Save this URL (e.g., `https://wonderful-cupcake-789012.netlify.app`)

---

## Part 5: Connect Everything Together 🔗

### Step 1: Update Railway Environment Variables

Go back to Railway and update these variables with your actual frontend URLs:

```
ADMIN_FRONTEND_URL=https://your-actual-admin-url.netlify.app
USER_FRONTEND_URL=https://your-actual-user-url.netlify.app
```

Railway will automatically redeploy with the new variables.

### Step 2: Verify CORS is Working

1. Visit your admin frontend URL
2. Try to login
3. Check browser console for any CORS errors
4. If you see CORS errors, double-check your Railway environment variables

---

## Part 6: Create Admin User 🔐

Your backend doesn't allow self-registration for admins. You need to create one manually:

### Option 1: Using MongoDB Atlas UI

1. Go to MongoDB Atlas
2. Click **"Browse Collections"** on your cluster
3. Find the `admins` collection
4. Click **"Insert Document"**
5. Add:
   ```json
   {
     "name": "Admin Name",
     "email": "admin@example.com",
     "password": "$2b$10$...",  // Use a hashed password
     "lastLogin": null,
     "createdAt": {"$date": "2025-01-01T00:00:00.000Z"},
     "updatedAt": {"$date": "2025-01-01T00:00:00.000Z"}
   }
   ```

### Option 2: Using the Script (Locally)

1. Create a `.env` file in your project root with your MongoDB connection string
2. Run:
   ```bash
   node add-admin.js "Admin Name" "admin@example.com" "password123"
   ```

---

## ✅ Deployment Complete! 

### Your Live URLs:

- **Backend API**: `https://YOUR-PROJECT.railway.app`
- **Admin Dashboard**: `https://YOUR-ADMIN.netlify.app`
- **Customer Website**: `https://YOUR-STORE.netlify.app`

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Railway build fails
- Check the build logs in Railway dashboard
- Make sure all dependencies are in `package.json`
- Verify `npm start` works locally

**Problem**: MongoDB connection fails
- Check your `MONGO_URI` in Railway variables
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check database user has correct permissions

### Frontend Issues

**Problem**: Can't connect to backend
- Check `VITE_API_URL` environment variable in Netlify
- Verify CORS is configured in Railway with your frontend URLs
- Check browser console for specific errors

**Problem**: 404 errors on refresh
- Make sure `netlify.toml` file exists with redirect rules
- Netlify should automatically handle SPA routing

### CORS Issues

**Problem**: "Blocked by CORS" errors
- Verify frontend URLs are correctly set in Railway environment variables
- Check Railway logs to see which origin is being blocked
- Make sure URLs don't have trailing slashes

---

## 🎉 Next Steps

1. **Custom Domains**: Add custom domains in Netlify and Railway settings
2. **SSL Certificates**: Automatically provided by Netlify and Railway
3. **Monitoring**: Set up error tracking (e.g., Sentry)
4. **Analytics**: Add Google Analytics or similar
5. **Backup**: Set up automated MongoDB backups in Atlas

---

## 💡 Tips

- **Environment Variables**: Never commit `.env` files to Git
- **Secrets**: Use strong, unique passwords and JWT secrets
- **Updates**: Push to GitHub to trigger automatic redeployments
- **Logs**: Check Railway and Netlify logs for debugging
- **Cost**: All services used have generous free tiers

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app/)
- [Netlify Docs](https://docs.netlify.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

Good luck with your deployment! 🚀
