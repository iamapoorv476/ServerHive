import mongoose, { Schema } from 'mongoose';
import { IBid } from '../types';

const bidSchema = new Schema<IBid>(
  {
    gigId: {
      type: Schema.Types.ObjectId,
      ref: 'Gig',
      required: [true, 'Gig ID is required'],
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Freelancer ID is required'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    proposedPrice: {
      type: Number,
      required: [true, 'Please provide a proposed price'],
      min: [0, 'Proposed price must be a positive number'],
    },
    status: {
      type: String,
      enum: ['pending', 'hired', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for getting freelancer details
bidSchema.virtual('freelancer', {
  ref: 'User',
  localField: 'freelancerId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for getting gig details
bidSchema.virtual('gig', {
  ref: 'Gig',
  localField: 'gigId',
  foreignField: '_id',
  justOne: true,
});

// Compound index to prevent duplicate bids from same freelancer on same gig
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

// Index for faster queries
bidSchema.index({ status: 1, createdAt: -1 });

const Bid = mongoose.model<IBid>('Bid', bidSchema);

export default Bid;