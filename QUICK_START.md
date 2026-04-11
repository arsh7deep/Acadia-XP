# 🚀 ACADIA XP - QUICK START GUIDE

## Estimated Runtime: 5 minutes

### Prerequisites
- ✅ Node.js installed
- ✅ MongoDB running locally
- ✅ All npm packages installed
- ✅ All environment variables set

---

## Step 1: Start MongoDB

Open a terminal and run:
```powershell
mongod
```

Keep this running in the background. You should see:
```
[initandlisten] Waiting for connections on port 27017
```

---

## Step 2: Start Backend Server

**Open NEW PowerShell terminal:**
```powershell
cd d:\Grademate\April\09.04.2026\acadia-xp\server
npm start
```

Expected output:
```
✅ MongoDB connected successfully
Server running on port 5000
```

---

## Step 3: Start Frontend App

**Open ANOTHER NEW PowerShell terminal:**
```powershell
cd d:\Grademate\April\09.04.2026\acadia-xp\client
npm start
```

Expected output:
```
Compiled successfully!

You can now view acadia-xp in the browser.
  http://localhost:3000
```

Browser should open automatically. If not, visit: **http://localhost:3000**

---

## Step 4: Test the App

### Create an Account
1. **Register** page should load
2. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `Password123`
3. Click "Register"
4. ✅ Auto-redirects to Dashboard

### Add Your First Activity
1. In Dashboard, scroll to "Add New Activity"
2. Select: `Study`
3. Set Duration: `2` hours
4. Click "✅ Add Activity"
5. ✅ XP updates to 20 (10 XP/hour × 2)
6. ✅ Level stays at 1
7. ✅ Streak increases to 1

### Check Your Progress
1. Scroll to "Achievements" section
2. You should see:
   - Level: 1
   - Total XP: 20
   - Streak: 1 🔥
   - Badges: 0/7

### Unlock Your First Badge
1. Keep adding activities until XP reaches 50
2. When XP ≥ 50:
   - 🎯 **"First Steps"** badge unlocks automatically
   - Appears in Achievements section
   - Shows unlock date

### Check the Leaderboard
1. Scroll to bottom: "Top 10 Leaderboard"
2. You should see yourself ranked #1
3. Add more users and see rankings update

---

## 5-Minute Test Checklist

- [ ] MongoDB started (mongod running)
- [ ] Backend started (Port 5000 running)
- [ ] Frontend started (Port 3000 opening)
- [ ] Registered new user
- [ ] Added activity
- [ ] XP updated correctly
- [ ] Earn first badge at 50 XP
- [ ] Streak showing as 1
- [ ] You appear on leaderboard

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot connect to MongoDB" | Run `mongod` in separate terminal |
| "Port 5000 in use" | Kill process: `Get-Process node \| Stop-Process` |
| "Port 3000 in use" | Change in `.env`: `PORT=3001` |
| "Blank screen" | Clear browser cache: Ctrl+Shift+Delete |
| "Login keeps failing" | Clear localStorage: F12 → Application → Clear |

---

## API Endpoints (For Testing with Postman)

### Register
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "John",
  "email": "john@test.com",
  "password": "123456"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "john@test.com",
  "password": "123456"
}
Response: { token: "eyJhbGc..." }
```

### Add Activity
```
POST http://localhost:5000/api/activity
Header: Authorization: Bearer TOKEN
Body: {
  "type": "study",
  "duration": 2
}
```

### Get Leaderboard
```
GET http://localhost:5000/api/leaderboard
```

---

## Next Steps

Once the app is running and tested:

1. **Create more test users** - Test leaderboard ranking
2. **Reach Level 2** - Unlock "Rising Star" badge (100 XP)
3. **Complete different activities** - Earn badges from other activity types
4. **Maintain streak** - Add activity daily to build streak
5. **Review code** - Explore backend logic in `/server/services`

---

## 🎓 Architecture Overview

```
User Registration
       ↓
JWT Token Generated & Stored in localStorage
       ↓
Token Auto-Attached to All API Requests
       ↓
Protected Routes Verify Token
       ↓
Activities Create XP
       ↓
XP Triggers Level & Badge Updates
       ↓
Real-time Dashboard Refresh
       ↓
Leaderboard Updates
```

---

## 📊 Badge Unlock Conditions

| Badge | Condition |
|-------|-----------|
| 🎯 First Steps | XP ≥ 50 |
| ⭐ Rising Star | Level ≥ 2 (100 XP) |
| 📚 Studious | 500+ XP earned |
| 🎓 Class Act | 10 classes attended |
| 💪 Fitness | 5 workouts completed |
| 👑 Legendary | Level ≥ 5 (400 XP) |
| 🔥 Week Warrior | 7-day streak |

---

## ✅ Success Indicators

When everything is working:
- ✅ Registration successful → Dashboard loads
- ✅ Activity submitted → XP updates instantly
- ✅ Level 2 reached → "Rising Star" badge appears
- ✅ Leaderboard showing → Your name at top
- ✅ Streak visible → Increments daily

---

**Status: READY TO LAUNCH 🚀**

Any issues? Check MongoDB is running and ports are available.
