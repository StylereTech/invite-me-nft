import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Analytics, Event } from '../models';

const router = Router();

// GET /analytics/events/:id - Get event analytics
router.get('/events/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Event not found' }
      });
    }

    // Verify host access
    if (event.host !== req.user?.wallet) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Not the event host' }
      });
    }

    const analytics = await Analytics.findOne({ event: req.params.id });
    
    if (!analytics) {
      return res.json({
        success: true,
        analytics: {
          eventId: event.eventId,
          views: 0,
          rsvps: 0,
          accepted: 0,
          declined: 0,
          checkIns: 0,
          transfers: 0
        }
      });
    }

    res.json({
      success: true,
      analytics: {
        eventId: analytics.eventId,
        views: analytics.views,
        rsvps: analytics.rsvps,
        accepted: analytics.accepted,
        declined: analytics.declined,
        checkIns: analytics.checkIns,
        transfers: analytics.transfers,
        lastUpdated: analytics.lastUpdated
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get analytics' }
    });
  }
});

export default router;
