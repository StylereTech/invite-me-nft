import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  wallet: string;
  email: string;
  name: string;
  avatar?: string;
  eventsHosted: mongoose.Types.ObjectId[];
  eventsAttended: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  wallet: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String },
  eventsHosted: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  eventsAttended: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
}, { timestamps: true });

UserSchema.index({ wallet: 1 });
UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
