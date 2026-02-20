import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Invite, Event, Analytics } from '../models';

const router = Router();

// GET /invites/:tokenId - Get invite details
router.get('/:tokenId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const invite = await Invite.findOne({ tokenId: req.params.tokenId })
      .populate('event');
    
    if (!invite) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Invite not found' }
      });
    }

    const event = await Event.findOne({ eventId: invite.eventId });

    res.json({
      success: true,
      invite: {
        tokenId: invite.tokenId,
        eventId: invite.eventId,
        event: event ? {
          name: event.name,
          date: event.date,
          location: event.location
        } : null,
        guest: invite.guest,
        guestEmail: invite.guestEmail,
        status: invite.status,
        rsvpDate: invite.rsvpDate,
        checkInDate: invite.checkInDate,
        metadataURI: invite.metadataURI,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${invite.tokenId}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to get invite' }
    });
  }
});

// POST /invites/:tokenId/rsvp - RSVP to invite
router.post('/:tokenId/rsvp', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { accepted } = req.body;
    
    const invite = await Invite.findOne({ tokenId: req.params.tokenId });
    if (!invite) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Invite not found' }
      });
    }

    if (invite.guest !== req.user?.wallet) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Not the invitee' }
      });
    }

    if (invite.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Already responded' }
      });
    }

    invite.status = accepted ? 'accepted' : 'declined';
    invite.rsvpDate = new Date();
    await invite.save();

    // Update analytics
    await Analytics.findOneAndUpdate(
      { eventId: invite.eventId },
      { 
        $inc: { 
          rsvps: 1,
          accepted: accepted ? 1 : 0,
          declined: accepted ? 0 : 1
        },
        $set: { lastUpdated: new Date() }
      }
    );

    res.json({
      success: true,
      status: invite.status,
      transactionHash: '0x...' // Would be from actual chain transaction
    });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to RSVP' }
    });
  }
});

// POST /invites/:tokenId/checkin - Check in at event
router.post('/:tokenId/checkin', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const invite = await Invite.findOne({ tokenId: req.params.tokenId });
    if (!invite) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Invite not found' }
      });
    }

    const event = await Event.findOne({ eventId: invite.eventId });
    if (!event) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Event not found' }
      });
    }

    // Only host or contract owner can check in
    if (event.host !== req.user?.wallet) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only host can check in guests' }
      });
    }

    if (invite.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Guest must RSVP first' }
      });
    }

    if (invite.checkInDate) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Already checked in' }
      });
    }

    invite.status = 'attended';
    invite.checkInDate = new Date();
    await invite.save();

    // Update analytics
    await Analytics.findOneAndUpdate(
      { eventId: invite.eventId },
      { 
        $inc: { checkIns: 1 },
        $set: { lastUpdated: new Date() }
      }
    );

    res.json({
      success: true,
      status: invite.status,
      checkInDate: invite.checkInDate,
      transactionHash: '0x...'
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to check in' }
    });
  }
});

export default router;
