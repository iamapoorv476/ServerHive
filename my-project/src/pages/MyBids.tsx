import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBids } from '../store/slices/bidsSlice';
import { FileText, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const MyBids: React.FC = () => {
  const dispatch = useAppDispatch();
  const { myBids, isLoading } = useAppSelector((state) => state.bids);

  useEffect(() => {
    dispatch(getMyBids());
  }, [dispatch]);

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      
      <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <h1 className="text-3xl font-bold mb-2">My Bids</h1>
        <p className="text-primary-100">Track your submitted proposals</p>
      </div>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your bids...</p>
        </div>
      ) : myBids.length > 0 ? (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            {myBids.length} {myBids.length === 1 ? 'bid' : 'bids'} submitted
          </div>
          <div className="space-y-4">
            {myBids.map((bid) => {
              const gigId = typeof bid.gigId === 'string' ? null : bid.gigId;
              
              if (!gigId) return null; 

              return (
                <div key={bid._id} className="card hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <Link
                        to={`/gigs/${gigId._id}`}
                        className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors flex items-center space-x-2"
                      >
                        <span>{gigId.title}</span>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className={`badge badge-${gigId.status}`}>
                          Gig: {gigId.status}
                        </span>
                        <span className={`badge badge-${bid.status}`}>
                          Bid: {bid.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center space-x-1 text-2xl font-bold text-primary-600">
                        <DollarSign className="w-6 h-6" />
                        <span>{bid.proposedPrice}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Your bid</p>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Proposal:</p>
                    <p className="text-gray-700">{bid.message}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Submitted {formatDate(bid.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>Gig Budget: ${gigId.budget}</span>
                    </div>
                  </div>

                  {bid.status === 'hired' && (
                    <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium text-center">
                        🎉 Congratulations! You were hired for this gig!
                      </p>
                    </div>
                  )}

                  {bid.status === 'rejected' && (
                    <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                      <p className="text-red-800 font-medium text-center">
                        Unfortunately, your bid was not selected.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 card">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No bids submitted yet</h3>
          <p className="text-gray-600 mb-6">Browse available gigs and submit your first bid</p>
          <Link to="/dashboard" className="inline-flex items-center space-x-2 btn btn-primary">
            <FileText className="w-5 h-5" />
            <span>Browse Gigs</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBids;