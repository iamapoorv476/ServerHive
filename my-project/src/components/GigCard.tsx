import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Clock, User } from 'lucide-react';
import { Gig } from '../types';

interface GigCardProps {
  gig: Gig;
}

const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const ownerName = typeof gig.ownerId === 'string' 
    ? 'Unknown' 
    : gig.ownerId.name;

  return (
    <Link
      to={`/gigs/${gig._id}`}
      className="card hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
            {gig.title}
          </h3>
          <p className="text-gray-600 line-clamp-2">{gig.description}</p>
        </div>
        <span className={`badge ${gig.status === 'open' ? 'badge-open' : 'badge-assigned'} ml-4`}>
          {gig.status}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold text-gray-900">${gig.budget}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(gig.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{ownerName}</span>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;