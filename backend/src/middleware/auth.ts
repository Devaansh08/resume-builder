import { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../services/firebase';

// Extend session type
declare module 'express-session' {
  interface SessionData {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    createdAt: number;
  }
}

declare module 'express' {
  interface Request {
    user?: {
      uid: string;
      email: string;
      displayName: string;
      photoURL: string;
    };
  }
}

/**
 * Middleware: Verify Firebase ID Token from Authorization header or session
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Check session first
    if (req.session?.uid) {
      req.user = {
        uid: req.session.uid,
        email: req.session.email || '',
        displayName: req.session.displayName || '',
        photoURL: req.session.photoURL || '',
      };
      return next();
    }

    // Fall back to Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized — no session or token provided' });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await verifyIdToken(idToken);

    req.user = {
      uid: decoded.uid,
      email: decoded.email || '',
      displayName: decoded.name || '',
      photoURL: decoded.picture || '',
    };

    next();
  } catch (err) {
    console.error('[Auth Middleware]', err);
    res.status(401).json({ error: 'Unauthorized — invalid token' });
  }
}

/**
 * Middleware: Optional auth — attaches user if available but does not block
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.session?.uid) {
      req.user = {
        uid: req.session.uid,
        email: req.session.email || '',
        displayName: req.session.displayName || '',
        photoURL: req.session.photoURL || '',
      };
    } else {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const idToken = authHeader.split('Bearer ')[1];
        const decoded = await verifyIdToken(idToken);
        req.user = {
          uid: decoded.uid,
          email: decoded.email || '',
          displayName: decoded.name || '',
          photoURL: decoded.picture || '',
        };
      }
    }
  } catch {
    // ignore auth errors in optional mode
  }
  next();
}
