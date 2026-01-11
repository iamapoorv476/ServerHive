import express from 'express';
import {
  createBid,
  getBidsForGig,
  getMyBids,
  hireBid,
  updateBid,
  deleteBid,
} from '../controllers/bidController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createBid);
router.get('/my/submitted', protect, getMyBids);
router.get('/:gigId', protect, getBidsForGig);
router.patch('/:bidId/hire', protect, hireBid);
router.put('/:bidId', protect, updateBid);
router.delete('/:bidId', protect, deleteBid);

export default router;