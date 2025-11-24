# ⚡ Quick Start Guide - Backend Server

## 🚨 IMPORTANT: Backend Server Start Karein

Agar aapko **"Connection Refused"** ya **"Failed to fetch"** error aa raha hai, to backend server start karna zaroori hai.

## 📋 Steps:

### 1. Terminal/Command Prompt Kholo
- **Windows:** `Win + R` → type `cmd` → Enter
- Ya **VS Code** mein Terminal open karo (`Ctrl + ``)

### 2. Backend Directory Mein Jao
```powershell
cd C:\Users\jamsh\OneDrive\Desktop\lawyer3-main\lawyer3-main\backend
```

### 3. Dependencies Check Karein (Pehli Baar)
```powershell
npm install
```

### 4. Server Start Karein
```powershell
npm run dev
```

**Ya agar `nodemon` nahi hai:**
```powershell
npm start
```

## ✅ Success Indicators:

Server start hone ke baad aapko console mein yeh dikhna chahiye:

```
✅ MongoDB connected successfully → mongodb://localhost:27017/lawSphere
✅ Server listening on http://localhost:5000
```

## ❌ Common Issues:

### 1. **MongoDB Not Running**
- Windows Services mein MongoDB service start karein
- Ya MongoDB manually start karein

### 2. **Port 5000 Already in Use**
- Port 5000 use karne wali process close karein
- Ya `.env` file mein `PORT=5001` set karein

### 3. **Module Not Found**
```powershell
npm install
```

### 4. **Nodemon Not Found**
```powershell
npm install nodemon --save-dev
```

## 🔍 Verify Server is Running:

Browser mein yeh URL open karo:
```
http://localhost:5000/health
```

Agar yeh response aaye to server running hai:
```json
{"ok": true}
```

## 📝 Note:

- Backend server **HAMESHA** running hona chahiye jab aap frontend use kar rahe ho
- Server ko **band mat karo** jab aap app use kar rahe ho
- Agar server restart karna ho to `Ctrl + C` press karo aur phir `npm run dev` run karo

