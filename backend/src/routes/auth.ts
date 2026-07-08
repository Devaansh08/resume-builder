import { Router, Request, Response } from 'express';
import { verifyIdToken } from '../services/firebase';

export const authRouter = Router();

/**
 * POST /api/auth/session
 * Exchange Firebase ID token for a server session + cookie
 */
authRouter.post('/session', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken || typeof idToken !== 'string') {
      res.status(400).json({ error: 'idToken is required' });
      return;
    }

    const decoded = await verifyIdToken(idToken);

    // Store user info in session
    req.session.uid = decoded.uid;
    req.session.email = decoded.email || '';
    req.session.displayName = decoded.name || '';
    req.session.photoURL = decoded.picture || '';
    req.session.createdAt = Date.now();

    res.json({
      success: true,
      user: {
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.name,
        photoURL: decoded.picture,
      },
    });
  } catch (err) {
    console.error('[Auth/session POST]', err);
    res.status(401).json({ error: 'Invalid Firebase ID token' });
  }
});

/**
 * DELETE /api/auth/session
 * Destroy session and clear cookie
 */
authRouter.delete('/session', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('[Auth/session DELETE]', err);
      res.status(500).json({ error: 'Failed to destroy session' });
      return;
    }
    res.clearCookie('resumeai.sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

/**
 * GET /api/auth/me
 * Return current session user
 */
authRouter.get('/me', (req: Request, res: Response) => {
  if (!req.session?.uid) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json({
    uid: req.session.uid,
    email: req.session.email,
    displayName: req.session.displayName,
    photoURL: req.session.photoURL,
    sessionAge: Date.now() - (req.session.createdAt || 0),
  });
});
