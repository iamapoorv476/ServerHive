import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGigs } from '../store/slices/gigsSlice';
import GigCard from '../components/GigCard';
import { Search, Briefcase, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { gigs, isLoading } = useAppSelector((state) => state.gigs);
  const { user } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    dispatch(getGigs({ search: '' }));
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(getGigs({ search: searchQuery }));
  };

  return (
    <div className="space-y-12">
      
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="relative px-12 py-20">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Next <br />
              <span className="text-blue-200">Opportunity</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
              Connect with talented freelancers or find your next project. GigFlow makes it easy to post jobs and submit proposals.
            </p>
            
            {!user && (
              <div className="flex space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-primary-500/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-primary-500/30 transition-all border-2 border-white/20"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{gigs.length}+</h3>
          <p className="text-gray-600">Active Gigs</p>
        </div>
        <div className="card text-center">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
          <p className="text-gray-600">Freelancers</p>
        </div>
        <div className="card text-center">
          <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
          <p className="text-gray-600">Success Rate</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Opportunities</h2>
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search gigs by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <button type="submit" className="btn btn-primary whitespace-nowrap">
            Search Gigs
          </button>
        </form>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Gigs</h2>
          {user && (
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading gigs...</p>
          </div>
        ) : gigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.slice(0, 6).map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No gigs found</p>
            <p className="text-gray-500 mt-2">Be the first to post a gig!</p>
            {user && (
              <Link
                to="/create-gig"
                className="inline-block mt-6 btn btn-primary"
              >
                Post a Gig
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;