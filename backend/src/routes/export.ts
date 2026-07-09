import { Router, Request, Response } from 'express';

export const exportRouter = Router();

/**
 * POST /api/export/pdf
 * Record a PDF export event (no auth required — PDF generation is client-side)
 */
exportRouter.post('/pdf', async (req: Request, res: Response) => {
  try {
    const { format = 'A4' } = req.body;

    res.json({
      success: true,
      message: 'Export acknowledged. Generate PDF client-side.',
      format,
    });
  } catch (err) {
    console.error('[Export POST /pdf]', err);
    res.status(500).json({ error: 'Failed to process export request' });
  }
});
