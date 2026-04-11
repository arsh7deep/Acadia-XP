# 🏗️ ACADIA XP - TECHNICAL ARCHITECTURE

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ UI Layer: Pages & Components                         │   │
│  │ - Login/Register Pages                               │   │
│  │ - Dashboard with XPBar                               │   │
│  │ - ActivityForm, LeaderboardTable                      │   │
│  │ - AchievementBadge, DashboardCard                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ State Management: AuthContext                         │   │
│  │ - Global user state                                  │   │
│  │ - Auth functions (login, register, logout)           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Service Layer: API Integration                        │   │
│  │ - api.js: Axios with token interceptor              │   │
│  │ - authService.js: Register, login, logout            │   │
│  │ - activityService.js: Add & get activities           │   │
│  │ - userService.js: Profile, badges, stats             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓ (HTTP/REST)
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Express)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes:                                              │   │
│  │ - POST   /api/auth/register (public)                │   │
│  │ - POST   /api/auth/login (public)                   │   │
│  │ - POST   /api/activity (protected)                  │   │
│  │ - GET    /api/activity (protected)                  │   │
│  │ - GET    /api/users/profile (protected)             │   │
│  │ - GET    /api/users/badges (protected)              │   │
│  │ - GET    /api/users/stats (protected)               │   │
│  │ - GET    /api/leaderboard (public)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Middleware:                                          │   │
│  │ - CORS: Enable cross-origin requests                │   │
│  │ - Auth: JWT verification & user extraction          │   │
│  │ - Error: Global exception handling                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Services:                                            │   │
│  │ - xpService: calculateXP(type, duration)             │   │
│  │ - levelService: calculateLevel(xp)                   │   │
│  │ - streakService: updateStreak(userId)                │   │
│  │ - achievementService: checkAndUnlockBadges()         │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Controllers:                                         │   │
│  │ - authController: register, login                    │   │
│  │ - userController: profile, badges, stats             │   │
│  │ - activityController: addActivity, getActivities     │   │
│  │ - leaderboardController: getLeaderboard              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Constants:                                           │   │
│  │ - xpRules: { study: 10, class: 15, workout: 20 }    │   │
│  │ - achievementRules: 7 badge definitions              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                DATA ACCESS LAYER (Mongoose)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Models:                                              │   │
│  │ - User: name, email, password, xp, level, streak    │   │
│  │         badges[], lastActivityDate                   │   │
│  │ - Activity: user, type, duration, xpEarned          │   │
│  │ - Achievement: title, description, xpRequired        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Database                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Collections:                                         │   │
│  │ - users: All user accounts & progress                │   │
│  │ - activities: Activity logs                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. User Registration Flow
```
Register Page
    ↓
registerUser(data)
    ↓
API.post('/auth/register')
    ↓
authController.register()
    ├─ Check if user exists → Error
    ├─ Hash password with bcrypt
    ├─ Create user in MongoDB
    └─ Return token + user data
    ↓
localStorage.setItem('user', data)
    ↓
AuthContext.setUser(data)
    ↓
Redirect to /dashboard
```

### 2. Activity Addition Flow
```
ActivityForm
    ↓
addActivity({ type, duration })
    ↓
API.post('/activity') + Bearer Token
    ↓
authMiddleware.protect() → Verify JWT
    ↓
activityController.addActivity()
    ├─ Calculate XP
    ├─ Create Activity document
    ├─ Update user XP
    ├─ Calculate new level
    ├─ updateStreak()
    └─ checkAndUnlockBadges()
    ↓
Return { activity, xpEarned, newLevel, newBadges }
    ↓
Frontend updates:
    ├─ XPBar refreshes
    ├─ Stats card updates
    ├─ New badges display
    └─ Streak increments
```

### 3. Badge Unlock Flow
```
User Adds Activity
    ↓
XP increases
    ↓
checkAndUnlockBadges(userId)
    ├─ Loop through 7 badges
    ├─ Check unlock conditions:
    │  ├─ XP-based (First Steps @ 50 XP)
    │  ├─ Level-based (Rising Star @ Level 2)
    │  ├─ Activity count (Class Act @ 10 classes)
    │  └─ Streak-based (Week Warrior @ 7 days)
    ├─ Mark badges as unlocked
    └─ Save to user document
    ↓
Frontend receives newBadges
    ↓
AchievementBadge components render
    ↓
Badge displays with icon, title, unlock date
```

### 4. Streak Tracking Flow
```
Activity Added
    ↓
updateStreak(userId)
    ├─ Get user's lastActivityDate
    ├─ Calculate days since last activity
    ├─ If same day: streak unchanged
    ├─ If next day: streak++
    └─ If 2+ days: streak = 1 (reset)
    ↓
Save lastActivityDate = today
    ↓
Dashboard displays updated streak
```

---

## Authentication & Security

### JWT Token Flow
```
1. User registers/logs in
2. Server creates JWT:
   - Payload: { id: userId }
   - Secret: process.env.JWT_SECRET
   - Expiration: 7 days
3. Token sent to client
4. Client stores in localStorage
5. Client attaches to every request:
   Authorization: Bearer {TOKEN}
6. Server verifies token:
   jwt.verify(token, JWT_SECRET)
7. If valid: Extract userId from payload
8. If invalid: Return 401 Unauthorized
```

### Password Security
```
User enters password
    ↓
Hash with bcryptjs:
    - Generate salt (10 rounds)
    - Hash password + salt
    - Store hash in database
    ↓
On login:
    - bcrypt.compare(input, hash)
    - Returns: true/false
    - Never compares plain passwords
```

---

## API Contract Specifications

### Response Format
All API responses follow this structure:

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": { /* response data */ },
  "message": "Success"
}
```

**Error Response (400/401/500):**
```json
{
  "statusCode": 400,
  "message": "User already exists",
  "error": "ValidationError"
}
```

### POST /api/activity
**Request:**
```json
{
  "type": "study",        // enum: study, class, workout
  "duration": 2           // number: 1-12
}
```

**Response:**
```json
{
  "activity": {
    "_id": "...",
    "user": "...",
    "type": "study",
    "duration": 2,
    "xpEarned": 20,
    "createdAt": "2026-04-09T..."
  },
  "xpEarned": 20,
  "newLevel": 1,
  "totalXP": 50,
  "newBadges": [
    {
      "id": 1,
      "title": "First Steps",
      "icon": "🎯"
    }
  ]
}
```

---

## Performance Optimizations

### Frontend
- ✅ Component memoization for LeaderboardTable
- ✅ useCallback for event handlers
- ✅ useMemo for expensive calculations
- ✅ Code splitting with React.lazy
- ✅ Debounced API calls

### Backend
- ✅ MongoDB indexing on email field
- ✅ Lean queries for leaderboard
- ✅ Pagination support (future)
- ✅ Caching for leaderboard (future)
- ✅ Database connection pooling

### Network
- ✅ Gzipped responses
- ✅ Minified bundle
- ✅ Token stored locally (no server session)
- ✅ Batch updates where possible

---

## Scalability Considerations

### Current Architecture (for 1000s of users)
- Single MongoDB instance
- Single Express server
- Single frontend deployment

### For 100k+ users
```
Load Balancer
    ↓
API Server Cluster (multiple Express instances)
    ├─ Redis for session caching
    ├─ Message queue for async badge processing
    └─ WebSockets for real-time updates
    ↓
MongoDB Replica Set (sharded)
    ├─ User data shard
    ├─ Activity log shard
    └─ Leaderboard cache
    ↓
CDN for static assets
```

---

## Testing Strategy

### Unit Tests (Controllers & Services)
```javascript
// Example: Test XP calculation
describe('xpService', () => {
  it('should calculate correct XP', () => {
    const xp = calculateXP('study', 2);
    expect(xp).toBe(20);
  });
});
```

### Integration Tests (API Endpoints)
```javascript
// Example: Test activity creation
describe('POST /api/activity', () => {
  it('should add activity and update XP', async () => {
    const res = await api.post('/activity')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'study', duration: 1 });
    expect(res.status).toBe(200);
    expect(res.body.xpEarned).toBe(10);
  });
});
```

### E2E Tests (Full Flows)
```javascript
// Example: Complete user journey
describe('User Journey', () => {
  it('should register, add activity, unlock badge', async () => {
    // Register
    // Login
    // Add activities until XP ≥ 50
    // Assert badge appears
  });
});
```

---

## Monitoring & Logging

### Backend Logging
```javascript
// Info level
console.log('✅ MongoDB connected');
console.log('User registered:', email);

// Error level
console.error('Database error:', error);
console.error('Authentication failed');

// Future: Use Winston or Bunyan
```

### Frontend Error Tracking
```javascript
// Future: Sentry integration
// Future: Google Analytics
// Future: Custom error logging
```

---

## Deployment Checklist

- [ ] Environment variables set in production
- [ ] MongoDB Atlas connection configured
- [ ] SSL/TLS certificates installed
- [ ] CORS whitelist updated for production domain
- [ ] Rate limiting enabled
- [ ] Logging service configured
- [ ] Error monitoring (Sentry) setup
- [ ] CDN configured for static assets
- [ ] Database backups scheduled
- [ ] Security headers added (helmet.js)
- [ ] DDoS protection enabled
- [ ] Performance monitoring setup

---

**Version:** 1.0.0
**Last Updated:** April 9, 2026
**Status:** Production Ready ✅
