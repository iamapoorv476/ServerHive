import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getMe } from './store/slices/authSlice';
import { initializeSocket, disconnectSocket, getSocket } from './utils/socket';
import toast, { Toaster } from 'react-hot-toast';
import { useAppDispatch,useAppSelector } from './store/hooks';
import { BidHiredEvent } from './types';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import GigDetails from './pages/GigDetails';
import CreateGig from './pages/CreateGig';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(getMe());
    }
  }, [dispatch]);

  // Initialize Socket.io when user is logged in
  useEffect(() => {
    if (user) {
      const socket = initializeSocket(user._id);

      // Listen for hire notifications
      socket.on('bid-hired', (data: BidHiredEvent) => {
        toast.success(` ${data.message}`, {
          duration: 6000,
          position: 'top-right',
        });
      });

      return () => {
        const currentSocket = getSocket();
        if (currentSocket) {
          currentSocket.off('bid-hired');
        }
      };
    } else {
      disconnectSocket();
    }
  }, [user]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
           
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/gigs/:id" element={<GigDetails />} />
            <Route path="/create-gig" element={<PrivateRoute><CreateGig /></PrivateRoute>} />
            <Route path="/my-gigs" element={<PrivateRoute><MyGigs /></PrivateRoute>} />
            <Route path="/my-bids" element={<PrivateRoute><MyBids /></PrivateRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
};

export default App;