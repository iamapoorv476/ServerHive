// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

// Gig Types
export interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  ownerId: User | string;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  hiredBidId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Bid Types
export interface Bid {
  _id: string;
  gigId: Gig | string;
  freelancerId: User | string;
  message: string;
  proposedPrice: number;
  status: 'pending' | 'hired' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedGigsResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  gigs: Gig[];
}

export interface BidsResponse {
  success: boolean;
  count: number;
  bids: Bid[];
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

// Gig Types
export interface CreateGigData {
  title: string;
  description: string;
  budget: number;
}

export interface GigsState {
  gigs: Gig[];
  gig: Gig | null;
  myGigs: Gig[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  total: number;
  currentPage: number;
  totalPages: number;
}

// Bid Types
export interface CreateBidData {
  gigId: string;
  message: string;
  proposedPrice: number;
}

export interface BidsState {
  bids: Bid[];
  myBids: Bid[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

// Socket.io Types
export interface BidHiredEvent {
  bidId: string;
  gigId: string;
  gigTitle: string;
  message: string;
}

// Query Params
export interface GigQueryParams {
  search?: string;
  page?: number;
}