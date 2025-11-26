# Deployment Guide for Render

This guide will help you deploy your MERN portfolio to Render.

## Prerequisites

1. GitHub account
2. Render account (sign up at https://render.com)
3. MongoDB Atlas account (for cloud database) or use Render's MongoDB

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
```

2. Add all files:
```bash
git add .
```

3. Commit:
```bash
git commit -m "Initial commit - MERN Portfolio"
```

4. Create a new repository on GitHub

5. Add remote and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Set up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get your connection string (replace `<password>` with your password)
5. Whitelist IP: Add `0.0.0.0/0` to allow all IPs (or Render's IPs)

## Step 3: Deploy on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: portfolio-mern (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: (leave empty)

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = A strong random string (generate one)
   - `PORT` = `10000` (Render sets this automatically, but good to have)

6. Click "Create Web Service"

## Step 4: Update Frontend API URLs (Optional)

If you want to use environment variables for API URLs, update your frontend files to use:

```javascript
import API_URL from './config/api';
// Then use: `${API_URL}/api/...`
```

Or create a `.env` file in frontend:
```
REACT_APP_API_URL=https://your-render-app.onrender.com
```

## Step 5: Build Script

The root `package.json` includes a build script that:
1. Installs all dependencies
2. Builds the frontend React app
3. Starts the backend server (which serves the frontend in production)

## Important Notes

- Render will automatically build and deploy on every push to main branch
- The backend serves the frontend build in production mode
- Make sure MongoDB Atlas allows connections from Render's IPs
- Keep your JWT_SECRET secure and don't commit it to GitHub
- The app will be available at: `https://your-app-name.onrender.com`

## Troubleshooting

1. **Build fails**: Check build logs in Render dashboard
2. **MongoDB connection error**: Verify connection string and IP whitelist
3. **API not working**: Check if API_URL is set correctly
4. **Frontend not loading**: Ensure build completed successfully

## Environment Variables Summary

Required in Render:
- `NODE_ENV` = `production`
- `MONGODB_URI` = Your MongoDB connection string
- `JWT_SECRET` = Random secret string
- `PORT` = `10000` (usually auto-set by Render)

Optional:
- `REACT_APP_API_URL` = Your Render app URL (if using separate frontend)

