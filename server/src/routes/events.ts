import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Event, Invite, Analytics } from '../models';

const router = Router();

// GET /events - List events
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    
    const query: any = { host: req.user?.wallet };
    if (status) query.status = status;

    const events = await Event.find(query)
      .sort({ date: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .populate('invites');

    const total = await Event.countDocuments(query);

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
        artwork: e.artwork,
        status: e.status,
        inviteCount: e.invites?.length || 0
      })),
      total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get events' }
    });
  }
});

// POST /events - Create event
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, date, location, capacity, isPrivate, artwork, contractAddress, eventId } = req.body;

    if (!name || !date || !location || !capacity) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' }
      });
    }

    const event = new Event({
      contractAddress: contractAddress || '',
      eventId: eventId || 1,
      host: req.user?.wallet || '',
      name,
      date: new Date(date),
      location,
      capacity,
      isPrivate,
      artwork,
      status: 'upcoming'
    });

    await event.save();

    // Create analytics entry
    const analytics = new Analytics({
      eventId: event.eventId,
      event: event._id,
      views: 0,
      rsvps: 0,
      accepted: 0,
      declined: 0,
      checkIns: 0,
      transfers: 0
    });
    await analytics.save();

    res.status(201).json({
      success: true,
      event: {
        id: event._id,
        contractAddress: event.contractAddress,
        eventId: event.eventId,
        host: event.host,
        name: event.name,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        artwork: event.artwork,
        status: event.status
      }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create event' }
    });
  }
});

// GET /events/:id - Get event details
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Event not found' }
      });
    }

    res.json({
      success: true,
      event: {
        id: event._id,
        contractAddress: event.contractAddress,
        eventId: event.eventId,
        host: event.host,
        name: event.name,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        artwork: event.artwork,
        status: event.status,
        createdAt: event.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get event' }
    });
  }
});

// PUT /events/:id - Update event
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, date, location, capacity, status } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Event not found' }
      });
    }

    if (event.host !== req.user?.wallet) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Not the event host' }
      });
    }

    if (name) event.name = name;
    if (date) event.date = new Date(date);
    if (location) event.location = location;
    if (capacity) event.capacity = capacity;
    if (status) event.status = status;

    await event.save();

    res.json({
      success: true,
      event: {
        id: event._id,
        contractAddress: event.contractAddress,
        eventId: event.eventId,
        host: event.host,
        name: event.name,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        artwork: event.artwork,
        status: event.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update event' }
    });
  }
});

// DELETE /events/:id - Delete event
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Event not found' }
      });
    }

    if (event.host !== req.user?.wallet) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Not the event host' }
      });
    }

    await Event.findByIdAndDelete(req.params.id);
    await Invite.deleteMany({ event: req.params.id });
    await Analytics.deleteOne({ event: req.params.id });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete event' }
    });
  }
});

// GET /events/:id/invites - Get all invites for event
router.get('/:id/invites', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const invites = await Invite.find({ event: req.params.id })
      .populate('event');

    res.json({
      success: true,
      invites: invites.map(i => ({
        tokenId: i.tokenId,
        eventId: i.eventId,
        guest: i.guest,
        guestEmail: i.guestEmail,
        status: i.status,
        rsvpDate: i.rsvpDate
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get invites' }
    });
  }
});

// POST /events/:id/mint-invites - Mint invites
router.post('/:id/mint-invites', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { guests } = req.body;

    if (!guests || !Array.isArray(guests)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Guests array required' }
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Event not found' }
      });
    }

    if (event.host !== req.user?.wallet) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Not the event host' }
      });
    }

    // Create invite records (actual minting happens on chain)
    const minted: any[] = [];
    for (let i = 0; i < guests.length; i++) {
      const guest = guests[i];
      const invite = new Invite({
        tokenId: Date.now() + i, // Temporary token ID
        eventId: event.eventId,
        event: event._id,
        guest: guest.wallet || '',
        guestEmail: guest.email,
        status: 'pending',
        metadataURI: guest.metadata
      });
      await invite.save();
      minted.push(invite);
    }

    res.status(201).json({
      success: true,
      minted: minted.length,
      invites: minted.map(i => ({
        tokenId: i.tokenId,
        guestEmail: i.guestEmail
      }))
    });
  } catch (error) {
    console.error('Mint invites error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to mint invites' }
    });
  }
});

export default router;
