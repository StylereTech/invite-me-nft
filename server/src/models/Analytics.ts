import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  eventId: number;
  event: mongoose.Types.ObjectId;
  views: number;
  rsvps: number;
  accepted: number;
  declined: number;
  checkIns: number;
  transfers: number;
  lastUpdated: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  eventId: { type: Number, required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  views: { type: Number, default: 0 },
  rsvps: { type: Number, default: 0 },
  accepted: { type: Number, default: 0 },
  declined: { type: Number, default: 0 },
  checkIns: { type: Number, default: 0 },
  transfers: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: false });

AnalyticsSchema.index({ eventId: 1 }, { unique: true });

export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
