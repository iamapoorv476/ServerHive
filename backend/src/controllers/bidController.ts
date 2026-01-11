import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Bid from '../models/Bid';
import Gig from '../models/Gig';
import { AuthRequest, CreateBidDTO, UpdateBidDTO } from '../types';
import { Server } from 'socket.io';

export const createBid = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const { gigId, message, proposedPrice }: CreateBidDTO = req.body;

    // Validate input
    if (!gigId || !message || proposedPrice === undefined) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
      return;
    }

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);

    if (!gig) {
      res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
      return;
    }

    if (gig.status !== 'open') {
      res.status(400).json({
        success: false,
        message: 'This gig is no longer accepting bids',
      });
      return;
    }

    // Prevent owner from bidding on their own gig
    if (gig.ownerId.toString() === req.user._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig',
      });
      return;
    }

    // Check if user already bid on this gig
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id,
    });

    if (existingBid) {
      res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig',
      });
      return;
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      proposedPrice,
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title description budget');

    res.status(201).json({
      success: true,
      bid: populatedBid,
    });
  } catch (error) {
    next(error);
  }
};

export const getBidsForGig = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const { gigId } = req.params;
    const gig = await Gig.findById(gigId);

    if (!gig) {
      res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
      return;
    }
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view bids for this gig',
      });
      return;
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBids = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title description budget status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids,
    });
  } catch (error) {
    next(error);
  }
};

export const hireBid = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Start a session for transaction
  const session = await mongoose.startSession();

  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    // Start transaction
    session.startTransaction();

    const { bidId } = req.params;

    // Find the bid with session
    const bid = await Bid.findById(bidId).session(session);

    if (!bid) {
      await session.abortTransaction();
      res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
      return;
    }
    const gig = await Gig.findById(bid.gigId).session(session);

    if (!gig) {
      await session.abortTransaction();
      res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
      return;
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      res.status(403).json({
        success: false,
        message: 'Not authorized to hire for this gig',
      });
      return;
    }
    if (gig.status !== 'open') {
      await session.abortTransaction();
      res.status(400).json({
        success: false,
        message: 'This gig has already been assigned',
      });
      return;
    }

    await Bid.findByIdAndUpdate(bidId, { status: 'hired' }, { session, new: true });
    await Gig.findByIdAndUpdate(
      bid.gigId,
      {
        status: 'assigned',
        hiredBidId: bidId,
      },
      { session, new: true }
    );

    await Bid.updateMany(
      {
        gigId: bid.gigId,
        _id: { $ne: bidId },
        status: 'pending',
      },
      { status: 'rejected' },
      { session }
    );

    await session.commitTransaction();

    const updatedBid = await Bid.findById(bidId)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title description budget status');
    const io: Server = req.app.get('io');
    if (io) {
      io.to(bid.freelancerId.toString()).emit('bid-hired', {
        bidId: bid._id.toString(),
        gigId: gig._id.toString(),
        gigTitle: gig.title,
        message: `Congratulations! You have been hired for "${gig.title}"`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully',
      bid: updatedBid,
    });
  } catch (error) {
    
    await session.abortTransaction();
    next(error);
  } finally {
    
    session.endSession();
  }
};


export const updateBid = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    let bid = await Bid.findById(req.params.bidId);

    if (!bid) {
      res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
      return;
    }

    // Make sure user is bid owner
    if (bid.freelancerId.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this bid',
      });
      return;
    }

    // Don't allow updating if bid is not pending
    if (bid.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: 'Cannot update a bid that has been processed',
      });
      return;
    }

    const { message, proposedPrice }: UpdateBidDTO = req.body;

    const updatedBid = await Bid.findByIdAndUpdate(
      req.params.bidId,
      { message, proposedPrice },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title description budget');

    res.status(200).json({
      success: true,
      bid: updatedBid,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBid = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const bid = await Bid.findById(req.params.bidId);

    if (!bid) {
      res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
      return;
    }

    // Make sure user is bid owner
    if (bid.freelancerId.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this bid',
      });
      return;
    }

    // Don't allow deleting if bid is not pending
    if (bid.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: 'Cannot delete a bid that has been processed',
      });
      return;
    }

    await bid.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bid deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};