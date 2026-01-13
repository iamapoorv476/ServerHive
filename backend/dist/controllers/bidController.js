"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBid = exports.updateBid = exports.hireBid = exports.getMyBids = exports.getBidsForGig = exports.createBid = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Bid_1 = __importDefault(require("../models/Bid"));
const Gig_1 = __importDefault(require("../models/Gig"));
const createBid = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }
        const { gigId, message, proposedPrice } = req.body;
        // Validate input
        if (!gigId || !message || proposedPrice === undefined) {
            res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
            return;
        }
        // Check if gig exists and is open
        const gig = await Gig_1.default.findById(gigId);
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
        const existingBid = await Bid_1.default.findOne({
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
        const bid = await Bid_1.default.create({
            gigId,
            freelancerId: req.user._id,
            message,
            proposedPrice,
        });
        const populatedBid = await Bid_1.default.findById(bid._id)
            .populate('freelancerId', 'name email')
            .populate('gigId', 'title description budget');
        res.status(201).json({
            success: true,
            bid: populatedBid,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createBid = createBid;
const getBidsForGig = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }
        const { gigId } = req.params;
        const gig = await Gig_1.default.findById(gigId);
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
        const bids = await Bid_1.default.find({ gigId })
            .populate('freelancerId', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: bids.length,
            bids,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getBidsForGig = getBidsForGig;
const getMyBids = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }
        const bids = await Bid_1.default.find({ freelancerId: req.user._id })
            .populate('gigId', 'title description budget status')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: bids.length,
            bids,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyBids = getMyBids;
const hireBid = async (req, res, next) => {
    // Start a session for transaction
    const session = await mongoose_1.default.startSession();
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
        const bid = await Bid_1.default.findById(bidId).session(session);
        if (!bid) {
            await session.abortTransaction();
            res.status(404).json({
                success: false,
                message: 'Bid not found',
            });
            return;
        }
        const gig = await Gig_1.default.findById(bid.gigId).session(session);
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
        await Bid_1.default.findByIdAndUpdate(bidId, { status: 'hired' }, { session, new: true });
        await Gig_1.default.findByIdAndUpdate(bid.gigId, {
            status: 'assigned',
            hiredBidId: bidId,
        }, { session, new: true });
        await Bid_1.default.updateMany({
            gigId: bid.gigId,
            _id: { $ne: bidId },
            status: 'pending',
        }, { status: 'rejected' }, { session });
        await session.commitTransaction();
        const updatedBid = await Bid_1.default.findById(bidId)
            .populate('freelancerId', 'name email')
            .populate('gigId', 'title description budget status');
        const io = req.app.get('io');
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
    }
    catch (error) {
        await session.abortTransaction();
        next(error);
    }
    finally {
        session.endSession();
    }
};
exports.hireBid = hireBid;
const updateBid = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }
        let bid = await Bid_1.default.findById(req.params.bidId);
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
        const { message, proposedPrice } = req.body;
        const updatedBid = await Bid_1.default.findByIdAndUpdate(req.params.bidId, { message, proposedPrice }, {
            new: true,
            runValidators: true,
        })
            .populate('freelancerId', 'name email')
            .populate('gigId', 'title description budget');
        res.status(200).json({
            success: true,
            bid: updatedBid,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBid = updateBid;
const deleteBid = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }
        const bid = await Bid_1.default.findById(req.params.bidId);
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
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBid = deleteBid;
//# sourceMappingURL=bidController.js.map