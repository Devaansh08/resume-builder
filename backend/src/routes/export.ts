import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { getFirestore } from '../services/firebase';

export const exportRouter = Router();

exportRouter.use(requireAuth);

/**
 * POST /api/export/pdf
 * Record a PDF export event and return download metadata
 * (Actual PDF generation happens client-side with jsPDF/html2canvas)
 */
exportRouter.post('/pdf', async (req: Request, res: Response) => {
  try {
    const { resumeId, format = 'A4' } = req.body;
    const db = getFirestore();

    // Log the export event
    await db.collection('exportLogs').add({
      resumeId,
      userId: req.user!.uid,
      format,
      exportedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Export logged. Generate PDF client-side.',
      format,
    });
  } catch (err) {
    console.error('[Export POST /pdf]', err);
    res.status(500).json({ error: 'Failed to log export' });
  }
});
