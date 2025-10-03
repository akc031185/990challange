import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

interface AuthResult {
  success: boolean;
  userId?: string;
  email?: string;
  name?: string;
  error?: string;
}

export function verifyAuth(req: NextApiRequest): AuthResult {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'Missing or invalid authorization header' };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    
    return {
      success: true,
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return { success: false, error: 'Invalid token' };
    }
    if (error instanceof jwt.TokenExpiredError) {
      return { success: false, error: 'Token expired' };
    }
    
    console.error('Auth verification error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export function generateToken(userId: string, email: string, name: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(
    { userId, email, name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function refreshToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Check if token expires within 7 days
    const expiresIn = decoded.exp * 1000 - Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    if (expiresIn < sevenDays) {
      return generateToken(decoded.userId, decoded.email, decoded.name);
    }
    
    return null; // Token doesn't need refresh yet
  } catch (error) {
    return null; // Token is invalid or expired
  }
}