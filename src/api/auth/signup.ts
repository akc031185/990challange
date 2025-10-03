import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../../lib/mongodb';

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name }: SignupRequest = req.body;

  // Validation
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const db = await getDatabase();
    const users = db.collection('users');

    // Check if user exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await users.insertOne({
      email: email.toLowerCase(),
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
        email: email.toLowerCase(),
        name 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    // Update last login
    await users.updateOne(
      { _id: result.insertedId },
      { $set: { lastLoginAt: new Date() } }
    );

    res.status(201).json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        email: email.toLowerCase(),
        name,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}