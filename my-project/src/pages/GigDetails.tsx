import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGig } from '../store/slices/gigsSlice';
import { createBid, getBidsForGig, hireBid } from '../store/slices/bidsSlice';
import { DollarSign, Clock, User, MessageSquare, Send, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Gig, Bid } from '../types';

interface BidFormData {
  message: string;
  proposedPrice: string;
}

const GigDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { gig, isLoading: gigLoading } = useAppSelector((state) => state.gigs);
  const { bids, isLoading: bidsLoading } = useAppSelector((state) => state.bids);

  const [showBidForm, setShowBidForm] = useState<boolean>(false);
  const [bidData, setBidData] = useState<BidFormData>({
    message: '',
    proposedPrice: '',
  });

  const isOwner = user && gig && typeof gig.ownerId !== 'string' && gig.ownerId._id === user._id;
  const hasUserBid = user && bids && bids.some((bid) => 
    typeof bid.freelancerId !== 'string' && bid.freelancerId._id === user._id
  );

  useEffect(() => {
    if (id) {
      dispatch(getGig(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (isOwner && gig && id) {
      dispatch(getBidsForGig(id));
    }
  }, [dispatch, id, isOwner, gig]);

  const handleBidSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to submit a bid');
      navigate('/login');
      return;
    }

    if (!id) {
      toast.error('Invalid gig ID');
      return;
    }

    if (!bidData.message || !bidData.proposedPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await dispatch(
        createBid({
          gigId: id,
          message: bidData.message,
          proposedPrice: parseFloat(bidData.proposedPrice),
        })
      ).unwrap();

      toast.success('Bid submitted successfully!');
      setBidData({ message: '', proposedPrice: '' });
      setShowBidForm(false);
    } catch (error: any) {
      toast.error(error || 'Failed to submit bid');
    }
  };

  const handleHire = async (bidId: string) => {
    if (window.confirm('Are you sure you want to hire this freelancer?')) {
      try {
        await dispatch(hireBid(bidId)).unwrap();
        toast.success('Freelancer hired successfully!');
        if (id) {
          dispatch(getGig(id));
          dispatch(getBidsForGig(id));
        }
      } catch (error: any) {
        toast.error(error || 'Failed to hire freelancer');
      }
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (gigLoading || !gig) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading gig details...</p>
      </div>
    );
  }

  const ownerName = typeof gig.ownerId === 'string' ? 'Unknown' : gig.ownerId.name;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
  
      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{gig.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Posted by {ownerName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{formatDate(gig.createdAt)}</span>
              </div>
            </div>
          </div>
          <span className={`badge ${gig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
            {gig.status}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{gig.description}</p>
        </div>

        <div className="flex items-center space-x-2 text-2xl font-bold text-primary-600">
          <DollarSign className="w-8 h-8" />
          <span>{gig.budget}</span>
        </div>

        {!isOwner && gig.status === 'open' && user && !hasUserBid && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            {!showBidForm ? (
              <button
                onClick={() => setShowBidForm(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Submit a Bid</span>
              </button>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Submit Your Bid</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposal
                  </label>
                  <textarea
                    value={bidData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setBidData({ ...bidData, message: e.target.value })
                    }
                    className="input"
                    rows={4}
                    placeholder="Explain why you're the best fit for this gig..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Price ($)
                  </label>
                  <input
                    type="number"
                    value={bidData.proposedPrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setBidData({ ...bidData, proposedPrice: e.target.value })
                    }
                    className="input"
                    placeholder="Enter your price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn btn-primary">
                    Submit Bid
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBidForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {!user && gig.status === 'open' && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-center">
              Please{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary-600 hover:underline"
              >
                login
              </button>{' '}
              to submit a bid
            </p>
          </div>
        )}
      </div>

      {isOwner && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bids Received</h2>
            <span className="badge badge-pending">{bids.length} bids</span>
          </div>

          {bidsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : bids.length > 0 ? (
            <div className="space-y-4">
              {bids.map((bid) => {
                const freelancerName = typeof bid.freelancerId === 'string' 
                  ? 'Unknown' 
                  : bid.freelancerId.name;
                const freelancerEmail = typeof bid.freelancerId === 'string' 
                  ? '' 
                  : bid.freelancerId.email;

                return (
                  <div
                    key={bid._id}
                    className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{freelancerName}</h3>
                          <p className="text-sm text-gray-600">{freelancerEmail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">${bid.proposedPrice}</p>
                        <span className={`badge badge-${bid.status}`}>{bid.status}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700">{bid.message}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatDate(bid.createdAt)}</span>
                      {bid.status === 'pending' && gig.status === 'open' && (
                        <button
                          onClick={() => handleHire(bid._id)}
                          className="btn btn-primary btn-sm flex items-center space-x-2"
                        >
                          <Award className="w-4 h-4" />
                          <span>Hire</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No bids received yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GigDetails;