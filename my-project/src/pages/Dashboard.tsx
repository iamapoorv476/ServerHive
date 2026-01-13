import React, { useEffect, useState } from 'react';
import { getGigs } from '../store/slices/gigsSlice';
import GigCard from '../components/GigCard';
import { Search, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { gigs, isLoading, total, currentPage, totalPages } = useAppSelector(
    (state) => state.gigs
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    dispatch(getGigs({ search: searchQuery, page }));
  }, [dispatch, searchQuery, page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    dispatch(getGigs({ search: searchQuery, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      
      <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <h1 className="text-3xl font-bold mb-2">Browse Gigs</h1>
        <p className="text-primary-100">Find your next opportunity</p>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Search Gigs</h2>
          <span className="text-sm text-gray-600">{total} total gigs</span>
        </div>
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <button type="submit" className="btn btn-primary whitespace-nowrap">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading gigs...</p>
        </div>
      ) : gigs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 card">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No gigs found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;