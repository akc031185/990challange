# 90-Day Challenge: MongoDB + Vercel Integration Guide

## 🚀 Architecture Overview

```
iOS App (Capacitor) ←→ Vercel API Routes ←→ MongoDB Atlas
         ↓                    ↓                ↓
    Local Storage    →    REST APIs    →   Cloud Database
    (Demo Mode)           (Production)      (User Data)
```

## 📁 Recommended Project Structure

```
your-90-day-challenge-repo/
├── mobile/                    # Current mobile app
│   ├── App.tsx
│   ├── components/
│   ├── hooks/
│   └── ...current files
├── api/                       # Vercel API routes
│   ├── auth/
│   │   ├── signup.ts
│   │   ├── signin.ts
│   │   └── refresh.ts
│   ├── challenge/
│   │   ├── data.ts           # Get/save challenge progress
│   │   ├── sync.ts           # Sync from localStorage
│   │   └── migrate.ts        # Demo to real account migration
│   ├── teams/
│   │   ├── create.ts
│   │   ├── join.ts
│   │   └── leaderboard.ts
│   └── health/
│       ├── sync.ts
│       └── recommendations.ts
├── lib/                       # Shared utilities
│   ├── mongodb.ts            # MongoDB connection
│   ├── auth.ts               # JWT handling
│   └── validation.ts         # Data validation
├── types/                     # Shared TypeScript types
│   └── index.ts              # Same types as mobile app
├── vercel.json               # Vercel configuration
└── package.json              # API dependencies
```

## 🔧 Phase 1: Prepare Backend (While App Store Reviewing)

### 1. Create Vercel Project Structure

```bash
# In your existing repo, create API structure
mkdir -p api/auth api/challenge api/teams api/health
mkdir -p lib types

# Install backend dependencies
npm install mongodb jsonwebtoken bcryptjs joi
npm install -D @types/jsonwebtoken @types/bcryptjs
```

### 2. MongoDB Setup

#### A. MongoDB Atlas Connection (`lib/mongodb.ts`):
```typescript
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('90_day_challenge');
}
```

#### B. Database Schema Design:
```typescript
// MongoDB Collections Structure

// users collection
interface User {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  lastLoginAt: Date;
  onboardingCompleted: boolean;
  subscription?: {
    plan: 'free' | 'premium';
    expiresAt?: Date;
  };
}

// challenge_data collection  
interface ChallengeData {
  _id: ObjectId;
  userId: ObjectId;
  startDate: string;
  currentDay: number;
  dailyData: Record<string, DailyData>; // Your existing DailyData type
  supplements: Supplements;
  userSettings: UserSettings;
  updatedAt: Date;
  version: number; // For conflict resolution
}

// teams collection
interface Team {
  _id: ObjectId;
  name: string;
  code: string; // 6-char join code
  createdBy: ObjectId;
  createdAt: Date;
  members: Array<{
    userId: ObjectId;
    joinedAt: Date;
    role: 'admin' | 'member';
  }>;
  settings: {
    isPublic: boolean;
    maxMembers: number;
  };
}

// leaderboard_cache collection (for performance)
interface LeaderboardEntry {
  _id: ObjectId;
  teamId: ObjectId;
  userId: ObjectId;
  date: string; // YYYY-MM-DD
  score: number;
  activitiesCompleted: number;
  perfectDay: boolean;
  calculatedAt: Date;
}
```

### 3. Authentication API (`api/auth/signup.ts`):
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../../lib/mongodb';
import { User } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name } = req.body;

  try {
    const db = await getDatabase();
    const users = db.collection<User>('users');

    // Check if user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await users.insertOne({
      email,
      passwordHash,
      name,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      onboardingCompleted: false,
    });

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: result.insertedId.toString(),
        email,
        name 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        email,
        name,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### 4. Challenge Data API (`api/challenge/data.ts`):
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../lib/mongodb';
import { verifyAuth } from '../../lib/auth';
import { ChallengeData } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authResult = verifyAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId } = authResult;
  const db = await getDatabase();
  const challengeCollection = db.collection<ChallengeData>('challenge_data');

  if (req.method === 'GET') {
    // Get user's challenge data
    const challengeData = await challengeCollection.findOne({ userId });
    
    if (!challengeData) {
      // Return default challenge data for new users
      const defaultData = {
        startDate: new Date().toISOString().split('T')[0],
        currentDay: 1,
        dailyData: {},
        supplements: { list: [], taken: false },
        userSettings: { calorieTarget: 2000, habitDescription: '' }
      };
      return res.json(defaultData);
    }

    res.json(challengeData);
  } 
  
  else if (req.method === 'POST') {
    // Save challenge data
    const challengeData = req.body;
    
    await challengeCollection.replaceOne(
      { userId },
      {
        userId,
        ...challengeData,
        updatedAt: new Date(),
        version: Date.now(), // Simple conflict resolution
      },
      { upsert: true }
    );

    res.json({ success: true });
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

### 5. Demo Migration API (`api/challenge/migrate.ts`):
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../lib/mongodb';
import { verifyAuth } from '../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = verifyAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId } = authResult;
  const { demoData } = req.body; // Data from localStorage

  try {
    const db = await getDatabase();
    const challengeCollection = db.collection('challenge_data');

    // Check if user already has data
    const existing = await challengeCollection.findOne({ userId });
    if (existing) {
      return res.status(400).json({ error: 'User already has challenge data' });
    }

    // Migrate demo data to real account
    await challengeCollection.insertOne({
      userId,
      ...demoData,
      migratedFromDemo: true,
      migratedAt: new Date(),
      updatedAt: new Date(),
      version: Date.now(),
    });

    res.json({ success: true, message: 'Demo data migrated successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: 'Migration failed' });
  }
}
```

## 🔄 Phase 2: Update Mobile App for Backend Integration

### 1. Environment Configuration:
```typescript
// utils/config.ts
export const CONFIG = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-app.vercel.app/api'
    : 'http://localhost:3000/api',
  
  USE_BACKEND: process.env.REACT_APP_USE_BACKEND === 'true',
  
  // Feature flags
  FEATURES: {
    REAL_AUTH: process.env.REACT_APP_USE_BACKEND === 'true',
    TEAM_SYNC: process.env.REACT_APP_USE_BACKEND === 'true',
    CLOUD_BACKUP: process.env.REACT_APP_USE_BACKEND === 'true',
  }
};
```

### 2. Updated useAuth Hook:
```typescript
// hooks/useAuth.ts - Enhanced version
export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const signUp = async (email: string, password: string, name: string) => {
    if (CONFIG.USE_BACKEND) {
      // Real backend signup
      const response = await fetch(`${CONFIG.API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setAccessToken(data.token);
        localStorage.setItem('access_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        // Migrate demo data if exists
        const demoData = localStorage.getItem('90dayChallenge');
        if (demoData) {
          await migrateDemoData(JSON.parse(demoData), data.token);
          localStorage.removeItem('90dayChallenge');
        }
        
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } else {
      // Demo mode (current implementation)
      return originalDemoSignUp(email, password, name);
    }
  };

  const migrateDemoData = async (demoData: any, token: string) => {
    try {
      await fetch(`${CONFIG.API_BASE_URL}/challenge/migrate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ demoData }),
      });
    } catch (error) {
      console.error('Demo migration failed:', error);
    }
  };

  // ... rest of auth implementation
};
```

### 3. Updated useChallenge Hook:
```typescript
// hooks/useChallenge.ts - Backend integration
export const useChallenge = (accessToken?: string | null) => {
  const [challengeData, setChallengeData] = useState<ChallengeData>(getDefaultChallengeData());

  const loadData = async () => {
    if (CONFIG.USE_BACKEND && accessToken && !accessToken.startsWith('demo_')) {
      // Load from backend
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/challenge/data`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        const data = await response.json();
        setChallengeData(data);
      } catch (error) {
        console.error('Failed to load from backend:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } else {
      // Demo mode - load from localStorage
      loadFromLocalStorage();
    }
  };

  const saveData = async (data: ChallengeData) => {
    setChallengeData(data);
    
    if (CONFIG.USE_BACKEND && accessToken && !accessToken.startsWith('demo_')) {
      // Save to backend
      try {
        await fetch(`${CONFIG.API_BASE_URL}/challenge/data`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error('Failed to save to backend:', error);
        // Still save to localStorage as backup
        localStorage.setItem('90dayChallenge', JSON.stringify(data));
      }
    } else {
      // Demo mode - save to localStorage
      localStorage.setItem('90dayChallenge', JSON.stringify(data));
    }
  };

  // ... rest of challenge implementation
};
```

## 🚀 Deployment Strategy

### 1. Vercel Configuration (`vercel.json`):
```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "JWT_SECRET": "@jwt-secret"
  },
  "build": {
    "env": {
      "REACT_APP_USE_BACKEND": "true"
    }
  }
}
```

### 2. Environment Variables:
```bash
# Vercel Environment Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/90_day_challenge
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production

# Mobile App Build Variables  
REACT_APP_USE_BACKEND=true
REACT_APP_API_URL=https://your-app.vercel.app/api
```

## 📱 Mobile App Deployment Options

### Option A: Feature Flag Approach (Recommended)
```typescript
// Build with backend disabled for App Store
REACT_APP_USE_BACKEND=false npm run build

// Update via app update later
REACT_APP_USE_BACKEND=true npm run build
```

### Option B: Separate Builds
```bash
# App Store version (demo mode)
npm run build:demo

# Backend version (for later update)
npm run build:production
```

## 🔄 Migration Timeline

### Week 1: App Store Submission
- ✅ Submit current demo app to App Store
- 🔧 Set up MongoDB Atlas + Vercel deployment
- 🔧 Implement authentication APIs

### Week 2: Backend Development  
- 🔧 Build challenge data APIs
- 🔧 Implement team management APIs  
- 🔧 Add migration endpoints

### Week 3: Testing & Integration
- 🧪 Test demo → backend migration
- 🧪 Test real-time team features
- 🧪 Load testing with MongoDB

### Week 4: Mobile App Update
- 📱 Submit app update with backend integration
- 🚀 Users seamlessly upgrade to cloud sync
- 📊 Monitor migration success rates

## 💡 Advanced Features for Later

### Real-time Features:
```typescript
// WebSocket integration for live leaderboards
// Server-Sent Events for team notifications
// Push notifications for team challenges
```

### Analytics & Insights:
```typescript
// User behavior tracking
// Challenge completion analytics  
// Team performance insights
// Churn prediction
```

### Premium Features:
```typescript
// Advanced progress analytics
// Custom challenge creation
// Team coaching tools
// Health data insights
```

---

**This architecture gives you the best of both worlds: immediate App Store launch with demo mode, then seamless upgrade to a scalable MongoDB/Vercel backend that can handle millions of users!** 🚀

Your users will never notice the transition, but you'll gain powerful team sync, real-time features, and cloud backup capabilities.