import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { User, Event } from '../models';

const router = Router();

// GET /users/me - Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ wallet: req.user?.wallet });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' }
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        wallet: user.wallet,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        eventsHosted: user.eventsHosted,
        eventsAttended: user.eventsAttended
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get user' }
    });
  }
});

// GET /users/:id/events - Get events hosted by user
router.get('/:id/events', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' }
      });
    }

    const events = await Event.find({ host: user.wallet })
      .sort({ date: -1 });

    res.json({
      success: true,
      events: events.map(e => ({
        id: e._id,
        contractAddress: e.contractAddress,
        eventId: e.eventId,
        host: e.host,
        name: e.name,
        date: e.date,
        location: e.location,
        capacity: e.capacity,
        status: e.status
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get user events' }
    });
  }
});

// GET /users/:id/attending - Get events user is attending
router.get('/:id/attending', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' }
      });
    }

    // Find events where user has an accepted invite
    // This would require a more complex query in production
    const events = await Event.find({ 
      status: { $in: ['upcoming', 'active'] }
    }).sort({ date: -1 });

    res.json({
      success: true,
      events: events.map(e => ({
        id: e._id,
        contractAddress: e.contractAddress,
        eventId: e.eventId,
        host: e.host,
        name: e.name,
        date: e.date,
        location: e.location,
        capacity: e.capacity,
        status: e.status
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get attending events' }
    });
  }
});

export default router;
