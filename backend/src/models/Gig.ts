import mongoose, { Schema } from 'mongoose';
import { IGig } from '../types';

const gigSchema = new Schema<IGig>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    budget: {
      type: Number,
      required: [true, 'Please provide a budget'],
      min: [0, 'Budget must be a positive number'],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'completed', 'cancelled'],
      default: 'open',
    },
    hiredBidId: {
      type: Schema.Types.ObjectId,
      ref: 'Bid',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gigSchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});

gigSchema.virtual('bidsCount', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'gigId',
  count: true,
});

gigSchema.index({ title: 'text', description: 'text' });
gigSchema.index({ status: 1, createdAt: -1 });

const Gig = mongoose.model<IGig>('Gig', gigSchema);

export default Gig;