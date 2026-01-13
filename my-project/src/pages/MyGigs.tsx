import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyGigs } from '../store/slices/gigsSlice';
import { Briefcase, Plus } from 'lucide-react';
import GigCard from '../components/GigCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const MyGigs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { myGigs, isLoading } = useAppSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(getMyGigs());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      
      <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Posted Gigs</h1>
            <p className="text-primary-100">Manage your job postings</p>
          </div>
          <Link
            to="/create-gig"
            className="btn bg-white text-primary-600 hover:bg-blue-50 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Post New Gig</span>
          </Link>
        </div>
      </div>

      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your gigs...</p>
        </div>
      ) : myGigs.length > 0 ? (
        <div>
          <div className="mb-4 text-sm text-gray-600">
            {myGigs.length} {myGigs.length === 1 ? 'gig' : 'gigs'} posted
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 card">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No gigs posted yet</h3>
          <p className="text-gray-600 mb-6">Start by creating your first gig</p>
          <Link
            to="/create-gig"
            className="inline-flex items-center space-x-2 btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            <span>Post Your First Gig</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyGigs;