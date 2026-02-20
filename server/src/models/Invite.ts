import mongoose, { Document, Schema } from 'mongoose';

export interface IInvite extends Document {
  tokenId: number;
  eventId: number;
  event: mongoose.Types.ObjectId;
  guest: string;
  guestEmail?: string;
  status: 'pending' | 'accepted' | 'declined' | 'attended';
  rsvpDate?: Date;
  checkInDate?: Date;
  metadataURI?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InviteSchema = new Schema<IInvite>({
  tokenId: { type: Number, required: true },
  eventId: { type: Number, required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  guest: { type: String, required: true },
  guestEmail: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined', 'attended'],
    default: 'pending'
  },
  rsvpDate: { type: Date },
  checkInDate: { type: Date },
  metadataURI: { type: String },
}, { timestamps: true });

InviteSchema.index({ tokenId: 1 }, { unique: true });
InviteSchema.index({ eventId: 1 });
InviteSchema.index({ guest: 1 });

export const Invite = mongoose.model<IInvite>('Invite', InviteSchema);
