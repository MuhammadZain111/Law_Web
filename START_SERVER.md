# Backend Server Start Karne Ka Guide

## Steps:

### 1. MongoDB Start Karein (Pehle)
MongoDB service running honi chahiye. Agar nahi hai to:
- Windows: MongoDB service start karein (Services app se)
- Ya MongoDB manually start karein

### 2. Backend Directory Mein Jao
```powershell
cd backend
```

### 3. Dependencies Install Karein (Agar pehle nahi kiye)
```powershell
npm install
```

### 4. Server Start Karein
**Development mode (auto-reload):**
```powershell
npm run dev
```

**Ya Production mode:**
```powershell
npm start
```

### 5. Verify Karein
Server start hone ke baad console mein yeh dikhna chahiye:
```
✅ MongoDB connected successfully
✅ Server listening on http://localhost:5000
```

### 6. Frontend Start Karein (Alag Terminal Mein)
```powershell
cd frontend
npm run dev
```

## Common Issues:

1. **MongoDB Connection Error:**
   - MongoDB service start karein
   - Ya MongoDB URI check karein

2. **Port Already in Use:**
   - Port 5000 use karne wali process close karein
   - Ya `.env` file mein `PORT=5001` set karein

3. **Module Not Found:**
   - `npm install` run karein backend directory mein

## Quick Start (One Command):
```powershell
cd backend && npm run dev
```

