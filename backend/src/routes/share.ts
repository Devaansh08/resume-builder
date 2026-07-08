import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { getFirestore } from '../services/firebase';
import { v4 as uuidv4 } from 'uuid';

export const shareRouter = Router();

/**
 * POST /api/share
 * Create a public share link for a resume
 */
shareRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { resumeId, isPublic = true } = req.body;
    const db = getFirestore();

    const resumeDoc = await db.collection('resumes').doc(resumeId).get();
    if (!resumeDoc.exists || resumeDoc.data()!.userId !== req.user!.uid) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    const shareId = uuidv4().replace(/-/g, '').slice(0, 12);
    const shareData = {
      shareId,
      resumeId,
      userId: req.user!.uid,
      isPublic,
      createdAt: new Date().toISOString(),
      views: 0,
    };

    await db.collection('shares').doc(shareId).set(shareData);

    res.json({
      shareId,
      url: `${process.env.CLIENT_URL}/r/${shareId}`,
    });
  } catch (err) {
    console.error('[Share POST /]', err);
    res.status(500).json({ error: 'Failed to create share link' });
  }
});

/**
 * GET /api/share/:shareId
 * Get public resume by share ID
 */
shareRouter.get('/:shareId', async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const shareDoc = await db.collection('shares').doc(req.params.shareId).get();

    if (!shareDoc.exists) {
      res.status(404).json({ error: 'Share link not found or expired' });
      return;
    }

    const share = shareDoc.data()!;
    if (!share.isPublic) {
      res.status(403).json({ error: 'This resume is private' });
      return;
    }

    const resumeDoc = await db.collection('resumes').doc(share.resumeId).get();
    if (!resumeDoc.exists) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    // Increment view count
    await shareDoc.ref.update({ views: (share.views || 0) + 1 });

    res.json({
      resume: { id: resumeDoc.id, ...resumeDoc.data() },
      shareInfo: { views: share.views + 1, createdAt: share.createdAt },
    });
  } catch (err) {
    console.error('[Share GET /:shareId]', err);
    res.status(500).json({ error: 'Failed to fetch shared resume' });
  }
});
