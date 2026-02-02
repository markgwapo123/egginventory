# MB Farm Fresh Eggs - Deployment Guide

## Backend Deployment on Render

### Step 1: Prepare Your Repository
1. Your code is already on GitHub at: `https://github.com/markgwapo123/egginventory.git`

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub account and select your repository: `markgwapo123/egginventory`
4. Configure the service:
   - **Name**: `mb-farm-backend` (or any name you prefer)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   - Click "Advanced" → "Add Environment Variable"
   - Add these variables:
     ```
     PORT=5001
     MONGODB_URI=mongodb+srv://eggadmin:eggpass123@firstproject.xg60l.mongodb.net/egg_inventory?appName=FirstProject
     NODE_ENV=production
     ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your Render URL (e.g., `https://mb-farm-backend.onrender.com`)

### Step 3: Update Frontend for Render URL
1. Open `frontend/.env.production`
2. Replace with your Render URL:
   ```
   REACT_APP_API_URL=https://your-render-app.onrender.com/api
   ```

---

## Frontend Deployment on Vercel

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New" → "Project"
3. Import your GitHub repository: `markgwapo123/egginventory`
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add Environment Variable:
   - Go to "Environment Variables"
   - Add:
     ```
     REACT_APP_API_URL=https://your-render-app.onrender.com/api
     ```
   - Replace with your actual Render URL from Step 2.8

6. Click "Deploy"
7. Wait for deployment (2-5 minutes)
8. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 3: Update Backend CORS
1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Update or add a new variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Or update the CORS in `backend/server.js` with your Vercel URL

---

## Alternative: Deploy Frontend via CLI

```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy: Yes
- Which scope: Your account
- Link to existing project: No
- Project name: mb-farm-frontend
- Directory: ./
- Override settings: No

---

## Post-Deployment Checklist

✅ Backend is running on Render
✅ Frontend is running on Vercel
✅ Environment variables are set correctly
✅ CORS is configured with your Vercel URL
✅ Test login with: admin@mbfarm.com / admin123
✅ Test all CRUD operations
✅ Check mobile responsiveness

---

## Troubleshooting

### Backend Issues:
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend Issues:
- Clear browser cache
- Check browser console for errors
- Verify API URL in environment variables
- Rebuild and redeploy if needed

### CORS Issues:
- Update CORS origin in backend/server.js
- Add your Vercel URL to allowed origins
- Redeploy backend after CORS changes

---

## Custom Domain (Optional)

### For Backend (Render):
1. Go to Settings → Custom Domain
2. Add your domain (e.g., api.mbfarm.com)

### For Frontend (Vercel):
1. Go to Settings → Domains
2. Add your domain (e.g., mbfarm.com)
