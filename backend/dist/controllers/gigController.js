"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyGigs = exports.deleteGig = exports.updateGig = exports.createGig = exports.getGig = exports.getGigs = void 0;
const Gig_1 = __importDefault(require("../models/Gig"));
const Bid_1 = __importDefault(require("../models/Bid"));
const getGigs = async (req, res, next) => {
    try {
        const { search, status, page = '1', limit = '10' } = req.query;
        const query = {};
        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        if (status) {
            query.status = status;
        }
        else {
            query.status = 'open';
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const gigs = await Gig_1.default.find(query)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);
        const total = await Gig_1.default.countDocuments(query);
        res.status(200).json({
            success: true,
            count: gigs.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            gigs,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getGigs = getGigs;
const getGig = async (req, res, next) => {
    try {
        const gig = await Gig_1.default.findById(req.params.id).populate('ownerId', 'name email');
        if (!gig) {
            res.status(404).json({
                success: false,
                message: 'Gig not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            gig,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getGig = getGig;
const createGig = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }
        const { title, description, budget } = req.body;
        // Validate input
        if (!title || !description || budget === undefined) {
            res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
            return;
        }
        const gig = await Gig_1.default.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
        });
        const populatedGig = await Gig_1.default.findById(gig._id).populate('ownerId', 'name email');
        res.status(201).json({
            success: true,
            gig: populatedGig,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createGig = createGig;
const updateGig = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }
        let gig = await Gig_1.default.findById(req.params.id);
        if (!gig) {
            res.status(404).json({
                success: false,
                message: 'Gig not found',
            });
            return;
        }
        // Make sure user is gig owner
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to update this gig',
            });
            return;
        }
        // Don't allow updating if gig is assigned
        if (gig.status === 'assigned') {
            res.status(400).json({
                success: false,
                message: 'Cannot update an assigned gig',
            });
            return;
        }
        const { title, description, budget } = req.body;
        const updatedGig = await Gig_1.default.findByIdAndUpdate(req.params.id, { title, description, budget }, {
            new: true,
            runValidators: true,
        }).populate('ownerId', 'name email');
        res.status(200).json({
            success: true,
            gig: updatedGig,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateGig = updateGig;
const deleteGig = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }
        const gig = await Gig_1.default.findById(req.params.id);
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
                message: 'Not authorized to delete this gig',
            });
            return;
        }
        await Bid_1.default.deleteMany({ gigId: req.params.id });
        await gig.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Gig deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteGig = deleteGig;
const getMyGigs = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
            return;
        }
        const gigs = await Gig_1.default.find({ ownerId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('ownerId', 'name email');
        res.status(200).json({
            success: true,
            count: gigs.length,
            gigs,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyGigs = getMyGigs;
//# sourceMappingURL=gigController.js.map