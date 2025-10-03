import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../../lib/mongodb';
import { verifyAuth } from '../../lib/auth';
import type { ChallengeData } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authResult = verifyAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ error: authResult.error || 'Unauthorized' });
  }

  const { userId } = authResult;
  const userObjectId = new ObjectId(userId);

  try {
    const db = await getDatabase();
    const challengeCollection = db.collection('challenge_data');

    if (req.method === 'GET') {
      // Get user's challenge data
      const challengeData = await challengeCollection.findOne({ userId: userObjectId });
      
      if (!challengeData) {
        // Return default challenge data for new users
        const defaultData: Omit<ChallengeData, '_id'> = {
          startDate: new Date().toISOString().split('T')[0],
          currentDay: 1,
          dailyData: {},
          supplements: { list: [], taken: false },
          userSettings: { 
            calorieTarget: 2000, 
            habitDescription: '' 
          }
        };
        return res.json(defaultData);
      }

      // Remove MongoDB _id from response and convert to client format
      const { _id, userId: _, ...clientData } = challengeData;
      res.json(clientData);
    } 
    
    else if (req.method === 'POST') {
      // Save challenge data
      const challengeData = req.body;
      
      // Validate required fields
      if (!challengeData.startDate || !challengeData.userSettings) {
        return res.status(400).json({ error: 'Invalid challenge data format' });
      }

      // Prepare data for MongoDB
      const mongoData = {
        userId: userObjectId,
        ...challengeData,
        updatedAt: new Date(),
        version: Date.now(), // Simple conflict resolution
      };

      await challengeCollection.replaceOne(
        { userId: userObjectId },
        mongoData,
        { upsert: true }
      );

      res.json({ success: true, updatedAt: mongoData.updatedAt });
    }
    
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Challenge data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}