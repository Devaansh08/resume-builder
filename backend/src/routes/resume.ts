import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { getFirestore } from '../services/firebase';
import { v4 as uuidv4 } from 'uuid';

export const resumeRouter = Router();

resumeRouter.use(requireAuth);

/**
 * GET /api/resume
 * List all resumes for the authenticated user
 */
resumeRouter.get('/', async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const snapshot = await db
      .collection('resumes')
      .where('userId', '==', req.user!.uid)
      .orderBy('updatedAt', 'desc')
      .get();

    const resumes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ resumes });
  } catch (err) {
    console.error('[Resume GET /]', err);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

/**
 * POST /api/resume
 * Create a new resume
 */
resumeRouter.post('/', async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const id = uuidv4();
    const now = new Date().toISOString();

    const resumeData = {
      id,
      userId: req.user!.uid,
      title: req.body.title || 'Untitled Resume',
      template: req.body.template || 'modern',
      theme: req.body.theme || 'light',
      sections: req.body.sections || {},
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('resumes').doc(id).set(resumeData);

    res.status(201).json({ resume: resumeData });
  } catch (err) {
    console.error('[Resume POST /]', err);
    res.status(500).json({ error: 'Failed to create resume' });
  }
});

/**
 * GET /api/resume/:id
 * Get a specific resume
 */
resumeRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const doc = await db.collection('resumes').doc(req.params.id).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    const data = doc.data()!;
    if (data.userId !== req.user!.uid) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.json({ resume: { id: doc.id, ...data } });
  } catch (err) {
    console.error('[Resume GET /:id]', err);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

/**
 * PUT /api/resume/:id
 * Update a resume
 */
resumeRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const docRef = db.collection('resumes').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    if (doc.data()!.userId !== req.user!.uid) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updateData = {
      ...req.body,
      userId: req.user!.uid,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updateData);

    // Save version history
    await db.collection('resumeVersions').add({
      resumeId: req.params.id,
      userId: req.user!.uid,
      snapshot: req.body,
      savedAt: new Date().toISOString(),
    });

    res.json({ success: true, updatedAt: updateData.updatedAt });
  } catch (err) {
    console.error('[Resume PUT /:id]', err);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

/**
 * DELETE /api/resume/:id
 */
resumeRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const docRef = db.collection('resumes').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    if (doc.data()!.userId !== req.user!.uid) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await docRef.delete();
    res.json({ success: true });
  } catch (err) {
    console.error('[Resume DELETE /:id]', err);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

/**
 * POST /api/resume/:id/duplicate
 */
resumeRouter.post('/:id/duplicate', async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const source = await db.collection('resumes').doc(req.params.id).get();

    if (!source.exists || source.data()!.userId !== req.user!.uid) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    const id = uuidv4();
    const now = new Date().toISOString();
    const newResume = {
      ...source.data(),
      id,
      title: `${source.data()!.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('resumes').doc(id).set(newResume);
    res.status(201).json({ resume: newResume });
  } catch (err) {
    console.error('[Resume POST /:id/duplicate]', err);
    res.status(500).json({ error: 'Failed to duplicate resume' });
  }
});

/**
 * GET /api/resume/:id/versions
 */
resumeRouter.get('/:id/versions', async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const snapshot = await db
      .collection('resumeVersions')
      .where('resumeId', '==', req.params.id)
      .where('userId', '==', req.user!.uid)
      .orderBy('savedAt', 'desc')
      .limit(20)
      .get();

    const versions = snapshot.docs.map(doc => ({
      id: doc.id,
      savedAt: doc.data().savedAt,
    }));

    res.json({ versions });
  } catch (err) {
    console.error('[Resume GET /:id/versions]', err);
    res.status(500).json({ error: 'Failed to fetch versions' });
  }
});
