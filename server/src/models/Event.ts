import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  contractAddress: string;
  eventId: number;
  host: string;
  name: string;
  date: Date;
  location: string;
  capacity: number;
  artwork?: string;
  invites: mongoose.Types.ObjectId[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  contractAddress: { type: String, required: true },
  eventId: { type: Number, required: true },
  host: { type: String, required: true, index: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  artwork: { type: String },
  invites: [{ type: Schema.Types.ObjectId, ref: 'Invite' }],
  status: { 
    type: String, 
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
}, { timestamps: true });

EventSchema.index({ eventId: 1 });
EventSchema.index({ host: 1, date: 1 });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
