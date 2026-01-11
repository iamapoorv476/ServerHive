import express from 'express';
import {
  getGigs,
  getGig,
  createGig,
  updateGig,
  deleteGig,
  getMyGigs,
} from '../controllers/gigController';
import { protect, optionalAuth } from '../middleware/auth';

const router = express.Router();

router.route('/').get(optionalAuth, getGigs).post(protect, createGig);

router.get('/my/posted', protect, getMyGigs);

router.route('/:id').get(optionalAuth, getGig).put(protect, updateGig).delete(protect, deleteGig);

export default router;