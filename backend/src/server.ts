import express, { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db';
import { errorHandler, notFound } from './middleware/error';

dotenv.config();

connectDB();

import authRoutes from './routes/auth';
import gigRoutes from './routes/gigs';
import bidRoutes from './routes/bids';

const app: Application = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

app.set('io', io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join-user-room', (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Socket.io ready for real-time notifications`);
});
process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

export default app;